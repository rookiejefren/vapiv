package middleware

import (
	"vapiv/internal/model"
	"vapiv/pkg/response"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type APIKeyMiddleware struct {
	db *gorm.DB
}

func NewAPIKeyMiddleware(db *gorm.DB) *APIKeyMiddleware {
	return &APIKeyMiddleware{db: db}
}

func (m *APIKeyMiddleware) Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		key := c.GetHeader("X-API-Key")
		if key == "" {
			key = c.Query("api_key")
		}
		if key == "" {
			response.Unauthorized(c, "missing api key")
			c.Abort()
			return
		}

		var apiKey model.APIKey
		if err := m.db.Where("key = ? AND status = 1", key).First(&apiKey).Error; err != nil {
			response.Unauthorized(c, "invalid api key")
			c.Abort()
			return
		}

		c.Set("user_id", apiKey.UserID)
		c.Set("api_key_id", apiKey.ID)
		c.Next()
	}
}
