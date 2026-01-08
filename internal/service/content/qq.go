package content

import "fmt"

type QQService struct{}

func NewQQService() *QQService {
	return &QQService{}
}

type QQAvatar struct {
	QQ     string `json:"qq"`
	Avatar string `json:"avatar"`
}

func (s *QQService) GetAvatar(qq string, size int) *QQAvatar {
	if size <= 0 {
		size = 100
	}
	return &QQAvatar{
		QQ:     qq,
		Avatar: fmt.Sprintf("https://q1.qlogo.cn/g?b=qq&nk=%s&s=%d", qq, size),
	}
}

func getString(m map[string]interface{}, key string) string {
	if v, ok := m[key].(string); ok {
		return v
	}
	return ""
}

func getInt64(m map[string]interface{}, key string) int64 {
	if v, ok := m[key].(float64); ok {
		return int64(v)
	}
	return 0
}
