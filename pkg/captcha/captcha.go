package captcha

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

var ErrRedisUnavailable = errors.New("redis unavailable, captcha service disabled")

type Service struct {
	rdb *redis.Client
	ttl time.Duration
}

func NewService(rdb *redis.Client) *Service {
	return &Service{rdb: rdb, ttl: 5 * time.Minute}
}

func (s *Service) Generate(email, purpose string) (string, error) {
	if s.rdb == nil {
		return "", ErrRedisUnavailable
	}
	code := generateCode()
	key := fmt.Sprintf("captcha:%s:%s", purpose, email)
	return code, s.rdb.Set(context.Background(), key, code, s.ttl).Err()
}

func (s *Service) Verify(email, purpose, code string) bool {
	if s.rdb == nil {
		return false
	}
	key := fmt.Sprintf("captcha:%s:%s", purpose, email)
	stored, err := s.rdb.Get(context.Background(), key).Result()
	if err != nil || stored != code {
		return false
	}
	s.rdb.Del(context.Background(), key)
	return true
}

func generateCode() string {
	b := make([]byte, 3)
	rand.Read(b)
	return fmt.Sprintf("%06d", int(b[0])*10000/256+int(b[1])*100/256+int(b[2])/3)
}
