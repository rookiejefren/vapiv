package middleware

import (
	"vapiv/internal/model"
	"vapiv/pkg/response"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type BillingMiddleware struct {
	db *gorm.DB
}

func NewBillingMiddleware(db *gorm.DB) *BillingMiddleware {
	return &BillingMiddleware{db: db}
}

func (m *BillingMiddleware) Charge() gin.HandlerFunc {
	return func(c *gin.Context) {
		endpoint := c.FullPath()

		var apiCfg model.APIConfig
		if err := m.db.Where("endpoint = ?", endpoint).First(&apiCfg).Error; err != nil {
			c.Next()
			return
		}

		if apiCfg.IsPublic {
			c.Next()
			return
		}

		userID, exists := c.Get("user_id")
		if !exists {
			response.Unauthorized(c, "authentication required")
			c.Abort()
			return
		}

		if apiCfg.Cost > 0 {
			var user model.User
			if err := m.db.First(&user, userID).Error; err != nil {
				response.Error(c, 500, "user not found")
				c.Abort()
				return
			}

			if user.Balance < apiCfg.Cost {
				response.Error(c, 402, "insufficient balance")
				c.Abort()
				return
			}

			m.db.Model(&user).Update("balance", gorm.Expr("balance - ?", apiCfg.Cost))
		}

		c.Next()
	}
}
