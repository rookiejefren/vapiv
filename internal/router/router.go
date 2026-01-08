package router

import (
	"time"

	"vapiv/internal/config"
	"vapiv/internal/handler"
	"vapiv/internal/middleware"
	"vapiv/internal/service/user"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"gorm.io/gorm"
)

func Setup(db *gorm.DB, rdb *redis.Client, cfg *config.Config) *gin.Engine {
	r := gin.Default()

	// 中间件
	jwtMw := middleware.NewJWTMiddleware(cfg.JWT.Secret)
	apiKeyMw := middleware.NewAPIKeyMiddleware(db)

	// 服务
	userSvc := user.NewService(db, cfg.JWT.Secret, cfg.JWT.ExpireHour)

	// Handler
	userH := handler.NewUserHandler(userSvc)
	apiKeyH := handler.NewAPIKeyHandler(userSvc)
	coreH := handler.NewCoreHandler()
	contentH := handler.NewContentHandler()

	// 公共路由
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// 用户认证
	auth := r.Group("/auth")
	{
		auth.POST("/register", userH.Register)
		auth.POST("/login", userH.Login)
	}

	// 需要JWT认证的路由
	userGroup := r.Group("/user", jwtMw.Auth())
	{
		userGroup.GET("/profile", func(c *gin.Context) {
			userID := c.GetUint("user_id")
			u, _ := userSvc.GetProfile(userID)
			c.JSON(200, gin.H{"code": 0, "data": u})
		})
		userGroup.POST("/apikey", apiKeyH.Create)
		userGroup.GET("/apikeys", apiKeyH.List)
		userGroup.DELETE("/apikey/:id", apiKeyH.Delete)
	}

	// 公共API
	var api *gin.RouterGroup
	if rdb != nil {
		rateLimiter := middleware.NewRateLimiter(rdb, 100, time.Minute)
		api = r.Group("/api", rateLimiter.Limit())
	} else {
		api = r.Group("/api")
	}
	api.GET("/ip", coreH.IPQuery)
	api.GET("/qq/avatar", contentH.QQAvatar)

	// 需要API Key的路由
	apiAuth := api.Group("", apiKeyMw.Auth())
	{
		apiAuth.POST("/crypto/encrypt", coreH.AESEncrypt)
		apiAuth.POST("/crypto/decrypt", coreH.AESDecrypt)
		apiAuth.GET("/bilibili/video", contentH.BilibiliVideo)
	}

	return r
}
