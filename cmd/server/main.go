package main

import (
	"log"

	"vapiv/internal/config"
	"vapiv/internal/model"
	"vapiv/internal/router"

	_ "vapiv/docs"

	"github.com/joho/godotenv"
)

// @title VAPIV API
// @version 1.0
// @description 公共API服务平台
// @host localhost:8080
// @BasePath /

func main() {
	godotenv.Load()

	cfg := config.Load()

	db, err := config.InitDB(cfg)
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	db.AutoMigrate(&model.User{}, &model.APIKey{}, &model.APIUsage{}, &model.APIConfig{})

	rdb, err := config.InitRedis(cfg)
	if err != nil {
		log.Println("warning: redis not available, rate limiting disabled")
		rdb = nil
	}

	r := router.Setup(db, rdb, cfg)

	log.Printf("Server starting on port %s", cfg.Server.Port)
	log.Printf("Swagger: http://localhost:%s/swagger/index.html", cfg.Server.Port)
	if err := r.Run(":" + cfg.Server.Port); err != nil {
		log.Fatal("failed to start server:", err)
	}
}
