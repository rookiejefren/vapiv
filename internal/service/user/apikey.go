package user

import (
	"crypto/rand"
	"encoding/hex"

	"vapiv/internal/model"
)

func (s *Service) CreateAPIKey(userID uint, name string) (*model.APIKey, error) {
	key := generateAPIKey()
	apiKey := &model.APIKey{
		UserID: userID,
		Key:    key,
		Name:   name,
	}

	if err := s.db.Create(apiKey).Error; err != nil {
		return nil, err
	}
	return apiKey, nil
}

func (s *Service) ListAPIKeys(userID uint) ([]model.APIKey, error) {
	var keys []model.APIKey
	err := s.db.Where("user_id = ?", userID).Find(&keys).Error
	return keys, err
}

func (s *Service) DeleteAPIKey(userID, keyID uint) error {
	return s.db.Where("id = ? AND user_id = ?", keyID, userID).Delete(&model.APIKey{}).Error
}

func (s *Service) GetProfile(userID uint) (*model.User, error) {
	var user model.User
	err := s.db.First(&user, userID).Error
	return &user, err
}

func generateAPIKey() string {
	bytes := make([]byte, 32)
	rand.Read(bytes)
	return "vapi_" + hex.EncodeToString(bytes)
}
