package model

import "time"

type APIUsage struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	UserID    uint      `gorm:"index" json:"user_id"`
	APIKeyID  uint      `gorm:"index" json:"api_key_id"`
	Endpoint  string    `gorm:"size:200;index" json:"endpoint"`
	Cost      int64     `gorm:"default:0" json:"cost"`
	IP        string    `gorm:"size:50" json:"ip"`
	CreatedAt time.Time `gorm:"index" json:"created_at"`
}

type APIConfig struct {
	ID       uint   `gorm:"primarykey" json:"id"`
	Endpoint string `gorm:"uniqueIndex;size:200" json:"endpoint"`
	Name     string `gorm:"size:100" json:"name"`
	Cost     int64  `gorm:"default:0" json:"cost"`
	IsPublic bool   `gorm:"default:true" json:"is_public"`
	Status   int    `gorm:"default:1" json:"status"`
}
