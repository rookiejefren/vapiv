package middleware

import (
	"context"
	"fmt"
	"time"

	"vapiv/pkg/response"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type RateLimiter struct {
	redis  *redis.Client
	limit  int
	window time.Duration
}

func NewRateLimiter(redis *redis.Client, limit int, window time.Duration) *RateLimiter {
	return &RateLimiter{redis: redis, limit: limit, window: window}
}

func (r *RateLimiter) Limit() gin.HandlerFunc {
	return func(c *gin.Context) {
		key := fmt.Sprintf("rate:%s", c.ClientIP())
		ctx := context.Background()

		count, _ := r.redis.Incr(ctx, key).Result()
		if count == 1 {
			r.redis.Expire(ctx, key, r.window)
		}

		if count > int64(r.limit) {
			response.Error(c, 429, "rate limit exceeded")
			c.Abort()
			return
		}
		c.Next()
	}
}
