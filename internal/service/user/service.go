package user

import (
	"errors"
	"time"

	"vapiv/internal/model"
	"vapiv/pkg/captcha"
	"vapiv/pkg/email"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Service struct {
	db         *gorm.DB
	jwtSecret  string
	jwtExpire  int
	emailSvc   *email.Service
	captchaSvc *captcha.Service
}

func NewService(db *gorm.DB, jwtSecret string, jwtExpire int, emailSvc *email.Service, captchaSvc *captcha.Service) *Service {
	return &Service{db: db, jwtSecret: jwtSecret, jwtExpire: jwtExpire, emailSvc: emailSvc, captchaSvc: captchaSvc}
}

func (s *Service) Register(username, email, password string) (*model.User, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &model.User{
		Username: username,
		Email:    email,
		Password: string(hash),
	}

	if err := s.db.Create(user).Error; err != nil {
		return nil, err
	}
	return user, nil
}

func (s *Service) Login(email, password string) (string, error) {
	var user model.User
	if err := s.db.Where("email = ?", email).First(&user).Error; err != nil {
		return "", errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", errors.New("invalid credentials")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * time.Duration(s.jwtExpire)).Unix(),
	})

	return token.SignedString([]byte(s.jwtSecret))
}

func (s *Service) SendCode(email, purpose string) error {
	code, err := s.captchaSvc.Generate(email, purpose)
	if err != nil {
		return err
	}
	return s.emailSvc.SendCode(email, code)
}

func (s *Service) VerifyCode(email, purpose, code string) bool {
	return s.captchaSvc.Verify(email, purpose, code)
}

func (s *Service) EmailExists(email string) bool {
	var count int64
	s.db.Model(&model.User{}).Where("email = ?", email).Count(&count)
	return count > 0
}

func (s *Service) ResetPassword(email, newPassword string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	return s.db.Model(&model.User{}).Where("email = ?", email).Update("password", string(hash)).Error
}
