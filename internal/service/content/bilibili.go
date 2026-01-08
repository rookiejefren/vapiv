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
	Title   string `json:"title"`
	Desc    string `json:"desc"`
	Pic     string `json:"pic"`
	View    int64  `json:"view"`
	Like    int64  `json:"like"`
	Coin    int64  `json:"coin"`
	Author  string `json:"author"`
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
		Title:  getString(data, "title"),
		Desc:   getString(data, "desc"),
		Pic:    getString(data, "pic"),
		View:   getInt64(stat, "view"),
		Like:   getInt64(stat, "like"),
		Coin:   getInt64(stat, "coin"),
		Author: getString(owner, "name"),
	}, nil
}
