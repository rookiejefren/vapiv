package main

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	ID        uint      `gorm:"primarykey"`
	Username  string    `gorm:"uniqueIndex;size:50"`
	Email     string    `gorm:"uniqueIndex;size:100"`
	Password  string    `gorm:"size:255"`
	Balance   float64   `gorm:"default:0"`
	Status    int       `gorm:"default:1"`
	CreatedAt time.Time
}

type APIKey struct {
	ID        uint      `gorm:"primarykey"`
	UserID    uint      `gorm:"index"`
	Key       string    `gorm:"uniqueIndex;size:128"`
	Name      string    `gorm:"size:100"`
	Status    int       `gorm:"default:1"`
	CreatedAt time.Time
}

func main() {
	godotenv.Load()

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), os.Getenv("DB_SSLMODE"))

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// 查找或创建用户
	var user User
	result := db.Where("username = ?", "admin").First(&user)
	if result.Error != nil {
		hash, _ := bcrypt.GenerateFromPassword([]byte("Admin123"), bcrypt.DefaultCost)
		user = User{
			Username:  "admin",
			Email:     "admin@vapiv.com",
			Password:  string(hash),
			Balance:   1000,
			Status:    1,
			CreatedAt: time.Now(),
		}
		db.Create(&user)
		fmt.Println("Created user: admin")
	}

	// 生成API Key
	bytes := make([]byte, 32)
	rand.Read(bytes)
	key := "vapi_" + hex.EncodeToString(bytes)

	apiKey := APIKey{
		UserID:    user.ID,
		Key:       key,
		Name:      "default",
		Status:    1,
		CreatedAt: time.Now(),
	}
	db.Create(&apiKey)

	fmt.Printf("\n=== API Key 已创建 ===\n")
	fmt.Printf("Key: %s\n", key)
}
