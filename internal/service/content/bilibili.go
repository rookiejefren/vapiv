package content

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type BilibiliService struct{}

func NewBilibiliService() *BilibiliService {
	return &BilibiliService{}
}

type VideoInfo struct {
	BVid    string `json:"bvid"`
	Aid     int64  `json:"aid"`
	Cid     int64  `json:"cid"`
	Title   string `json:"title"`
	Desc    string `json:"desc"`
	Pic     string `json:"pic"`
	View    int64  `json:"view"`
	Like    int64  `json:"like"`
	Coin    int64  `json:"coin"`
	Author  string `json:"author"`
}

type VideoURL struct {
	Quality     int      `json:"quality"`
	Description string   `json:"description"`
	VideoURL    string   `json:"video_url"`
	AudioURL    string   `json:"audio_url,omitempty"`
	Duration    int64    `json:"duration"`
}

func (s *BilibiliService) GetVideoInfo(bvid string) (*VideoInfo, error) {
	url := fmt.Sprintf("https://api.bilibili.com/x/web-interface/view?bvid=%s", bvid)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	data, ok := result["data"].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid response")
	}

	stat, _ := data["stat"].(map[string]interface{})
	owner, _ := data["owner"].(map[string]interface{})

	return &VideoInfo{
		BVid:   getString(data, "bvid"),
		Aid:    getInt64(data, "aid"),
		Cid:    getInt64(data, "cid"),
		Title:  getString(data, "title"),
		Desc:   getString(data, "desc"),
		Pic:    getString(data, "pic"),
		View:   getInt64(stat, "view"),
		Like:   getInt64(stat, "like"),
		Coin:   getInt64(stat, "coin"),
		Author: getString(owner, "name"),
	}, nil
}

func (s *BilibiliService) GetVideoURL(bvid string) (*VideoURL, error) {
	info, err := s.GetVideoInfo(bvid)
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("https://api.bilibili.com/x/player/playurl?bvid=%s&cid=%d&qn=80&fnval=1", bvid, info.Cid)
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Referer", "https://www.bilibili.com")
	req.Header.Set("User-Agent", "Mozilla/5.0")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	data, ok := result["data"].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid response")
	}

	durl, ok := data["durl"].([]interface{})
	if !ok || len(durl) == 0 {
		return nil, fmt.Errorf("no video url found")
	}

	first := durl[0].(map[string]interface{})
	return &VideoURL{
		Quality:     int(getInt64(data, "quality")),
		Description: info.Title,
		VideoURL:    getString(first, "url"),
		Duration:    getInt64(first, "length") / 1000,
	}, nil
}
