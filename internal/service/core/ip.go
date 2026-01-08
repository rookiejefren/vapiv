package core

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type IPService struct{}

func NewIPService() *IPService {
	return &IPService{}
}

type IPInfo struct {
	IP       string `json:"ip"`
	Country  string `json:"country"`
	Region   string `json:"region"`
	City     string `json:"city"`
	ISP      string `json:"isp"`
}

func (s *IPService) Query(ip string) (*IPInfo, error) {
	// 如果是内网IP或空，获取公网IP
	if ip == "" || ip == "127.0.0.1" || ip == "::1" || isPrivateIP(ip) {
		ip = ""
	}

	resp, err := http.Get(fmt.Sprintf("http://ip-api.com/json/%s?lang=zh-CN", ip))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	// 检查API返回状态
	if status, ok := result["status"].(string); ok && status == "fail" {
		msg := getString(result, "message")
		return &IPInfo{IP: ip, Country: "查询失败: " + msg}, nil
	}

	return &IPInfo{
		IP:      getString(result, "query"),
		Country: getString(result, "country"),
		Region:  getString(result, "regionName"),
		City:    getString(result, "city"),
		ISP:     getString(result, "isp"),
	}, nil
}

func isPrivateIP(ip string) bool {
	return len(ip) > 3 && (ip[:3] == "10." || ip[:4] == "172." || ip[:8] == "192.168.")
}

func getString(m map[string]interface{}, key string) string {
	if v, ok := m[key].(string); ok {
		return v
	}
	return ""
}
