package core

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"
	"time"
)

type DouyinService struct {
	client *http.Client
}

func NewDouyinService() *DouyinService {
	return &DouyinService{
		client: &http.Client{
			Timeout: 15 * time.Second,
			CheckRedirect: func(req *http.Request, via []*http.Request) error {
				return http.ErrUseLastResponse
			},
		},
	}
}

type DouyinVideo struct {
	VideoID      string   `json:"video_id"`
	Title        string   `json:"title"`
	Author       string   `json:"author"`
	AuthorUID    string   `json:"author_uid"`
	Avatar       string   `json:"avatar"`
	Cover        string   `json:"cover"`
	VideoURL     string   `json:"video_url"`
	Duration     int64    `json:"duration"`
	CreateTime   int64    `json:"create_time"`
	DiggCount    int64    `json:"digg_count"`
	CommentCount int64    `json:"comment_count"`
	ShareCount   int64    `json:"share_count"`
	PlayCount    int64    `json:"play_count"`
	Music        string   `json:"music"`
	MusicURL     string   `json:"music_url"`
	Tags         []string `json:"tags"`
}

func (s *DouyinService) ParseVideo(shareURL string) (*DouyinVideo, error) {
	videoID, err := s.extractVideoID(shareURL)
	if err != nil {
		return nil, err
	}

	return s.getVideoInfo(videoID)
}

func (s *DouyinService) extractVideoID(shareURL string) (string, error) {
	// 如果直接是视频ID（纯数字）
	if matched, _ := regexp.MatchString(`^\d+$`, shareURL); matched {
		return shareURL, nil
	}

	// 处理短链接，获取重定向后的真实URL
	if strings.Contains(shareURL, "v.douyin.com") || strings.Contains(shareURL, "vm.tiktok.com") {
		realURL, err := s.getRealURL(shareURL)
		if err != nil {
			return "", err
		}
		shareURL = realURL
	}

	// 从URL中提取视频ID
	patterns := []string{
		`video/(\d+)`,
		`note/(\d+)`,
		`modal_id=(\d+)`,
	}

	for _, pattern := range patterns {
		re := regexp.MustCompile(pattern)
		matches := re.FindStringSubmatch(shareURL)
		if len(matches) > 1 {
			return matches[1], nil
		}
	}

	return "", errors.New("无法从URL中提取视频ID")
}

func (s *DouyinService) getRealURL(shortURL string) (string, error) {
	req, err := http.NewRequest("GET", shortURL, nil)
	if err != nil {
		return "", err
	}

	req.Header.Set("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1")

	resp, err := s.client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	location := resp.Header.Get("Location")
	if location == "" {
		return "", errors.New("无法获取重定向URL")
	}

	return location, nil
}

func (s *DouyinService) getVideoInfo(videoID string) (*DouyinVideo, error) {
	// 直接访问抖音网页版获取SSR数据
	pageURL := fmt.Sprintf("https://www.douyin.com/video/%s", videoID)

	req, err := http.NewRequest("GET", pageURL, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
	req.Header.Set("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8")
	req.Header.Set("Cookie", "ttwid=1%7C1234567890; __ac_nonce=0")

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	htmlContent := string(body)

	// 从SSR数据中提取视频信息
	re := regexp.MustCompile(`<script id="RENDER_DATA" type="application/json">([^<]+)</script>`)
	matches := re.FindStringSubmatch(htmlContent)

	if len(matches) < 2 {
		// 尝试另一种格式
		re = regexp.MustCompile(`window\._ROUTER_DATA\s*=\s*(\{[^;]+\});`)
		matches = re.FindStringSubmatch(htmlContent)
	}

	if len(matches) < 2 {
		return nil, errors.New("无法从页面中提取视频数据，请检查链接是否有效")
	}

	// URL解码
	jsonData := matches[1]
	jsonData = strings.ReplaceAll(jsonData, "%22", "\"")
	jsonData = strings.ReplaceAll(jsonData, "%7B", "{")
	jsonData = strings.ReplaceAll(jsonData, "%7D", "}")
	jsonData = strings.ReplaceAll(jsonData, "%5B", "[")
	jsonData = strings.ReplaceAll(jsonData, "%5D", "]")
	jsonData = strings.ReplaceAll(jsonData, "%3A", ":")
	jsonData = strings.ReplaceAll(jsonData, "%2C", ",")
	jsonData = strings.ReplaceAll(jsonData, "%2F", "/")

	// 尝试解析JSON
	video, err := s.parseRenderData(jsonData, videoID)
	if err != nil {
		// 尝试备用API
		return s.getVideoInfoFromAPI(videoID)
	}

	return video, nil
}

func (s *DouyinService) parseRenderData(jsonData string, videoID string) (*DouyinVideo, error) {
	var data map[string]interface{}
	if err := json.Unmarshal([]byte(jsonData), &data); err != nil {
		return nil, err
	}

	// 遍历查找aweme_detail
	awemeDetail := s.findAwemeDetail(data)
	if awemeDetail == nil {
		return nil, errors.New("未找到视频详情")
	}

	video := &DouyinVideo{
		VideoID: videoID,
	}

	if desc, ok := awemeDetail["desc"].(string); ok {
		video.Title = desc
	}

	if author, ok := awemeDetail["author"].(map[string]interface{}); ok {
		if nickname, ok := author["nickname"].(string); ok {
			video.Author = nickname
		}
		if uid, ok := author["uid"].(string); ok {
			video.AuthorUID = uid
		}
	}

	if stats, ok := awemeDetail["statistics"].(map[string]interface{}); ok {
		if v, ok := stats["digg_count"].(float64); ok {
			video.DiggCount = int64(v)
		}
		if v, ok := stats["comment_count"].(float64); ok {
			video.CommentCount = int64(v)
		}
		if v, ok := stats["share_count"].(float64); ok {
			video.ShareCount = int64(v)
		}
		if v, ok := stats["play_count"].(float64); ok {
			video.PlayCount = int64(v)
		}
	}

	if videoData, ok := awemeDetail["video"].(map[string]interface{}); ok {
		if playAddr, ok := videoData["play_addr"].(map[string]interface{}); ok {
			if urlList, ok := playAddr["url_list"].([]interface{}); ok && len(urlList) > 0 {
				if url, ok := urlList[0].(string); ok {
					video.VideoURL = strings.ReplaceAll(url, "playwm", "play")
				}
			}
		}
		if cover, ok := videoData["cover"].(map[string]interface{}); ok {
			if urlList, ok := cover["url_list"].([]interface{}); ok && len(urlList) > 0 {
				if url, ok := urlList[0].(string); ok {
					video.Cover = url
				}
			}
		}
	}

	return video, nil
}

func (s *DouyinService) findAwemeDetail(data interface{}) map[string]interface{} {
	switch v := data.(type) {
	case map[string]interface{}:
		if _, ok := v["aweme_id"]; ok {
			if _, ok := v["desc"]; ok {
				return v
			}
		}
		for _, value := range v {
			if result := s.findAwemeDetail(value); result != nil {
				return result
			}
		}
	case []interface{}:
		for _, item := range v {
			if result := s.findAwemeDetail(item); result != nil {
				return result
			}
		}
	}
	return nil
}

func (s *DouyinService) getVideoInfoFromAPI(videoID string) (*DouyinVideo, error) {
	// 备用API
	apiURL := fmt.Sprintf("https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=%s", videoID)

	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15")

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if len(body) == 0 {
		return nil, errors.New("无法获取视频信息，可能是网络限制或视频不存在")
	}

	var result struct {
		ItemList []struct {
			AwemeID string `json:"aweme_id"`
			Desc    string `json:"desc"`
			Author  struct {
				Nickname    string `json:"nickname"`
				UID         string `json:"uid"`
				AvatarThumb struct {
					URLList []string `json:"url_list"`
				} `json:"avatar_thumb"`
			} `json:"author"`
			Video struct {
				PlayAddr struct {
					URLList []string `json:"url_list"`
				} `json:"play_addr"`
				Cover struct {
					URLList []string `json:"url_list"`
				} `json:"cover"`
				Duration int64 `json:"duration"`
			} `json:"video"`
			CreateTime int64 `json:"create_time"`
			Statistics struct {
				DiggCount    int64 `json:"digg_count"`
				CommentCount int64 `json:"comment_count"`
				ShareCount   int64 `json:"share_count"`
				PlayCount    int64 `json:"play_count"`
			} `json:"statistics"`
			Music struct {
				Title   string `json:"title"`
				PlayURL struct {
					URLList []string `json:"url_list"`
				} `json:"play_url"`
			} `json:"music"`
		} `json:"item_list"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("解析响应失败: %v", err)
	}

	if len(result.ItemList) == 0 {
		return nil, errors.New("未找到视频信息，可能视频已删除或链接无效")
	}

	item := result.ItemList[0]

	video := &DouyinVideo{
		VideoID:      item.AwemeID,
		Title:        item.Desc,
		Author:       item.Author.Nickname,
		AuthorUID:    item.Author.UID,
		Duration:     item.Video.Duration,
		CreateTime:   item.CreateTime,
		DiggCount:    item.Statistics.DiggCount,
		CommentCount: item.Statistics.CommentCount,
		ShareCount:   item.Statistics.ShareCount,
		PlayCount:    item.Statistics.PlayCount,
		Music:        item.Music.Title,
	}

	if len(item.Author.AvatarThumb.URLList) > 0 {
		video.Avatar = item.Author.AvatarThumb.URLList[0]
	}

	if len(item.Video.Cover.URLList) > 0 {
		video.Cover = item.Video.Cover.URLList[0]
	}

	if len(item.Video.PlayAddr.URLList) > 0 {
		videoURL := item.Video.PlayAddr.URLList[0]
		video.VideoURL = strings.ReplaceAll(videoURL, "playwm", "play")
	}

	if len(item.Music.PlayURL.URLList) > 0 {
		video.MusicURL = item.Music.PlayURL.URLList[0]
	}

	return video, nil
}
