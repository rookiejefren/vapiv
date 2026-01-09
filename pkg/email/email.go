package email

import (
	"fmt"
	"net/smtp"
)

type Service struct {
	host     string
	port     int
	username string
	password string
	from     string
}

func NewService(host string, port int, username, password, from string) *Service {
	return &Service{
		host:     host,
		port:     port,
		username: username,
		password: password,
		from:     from,
	}
}

func (s *Service) SendCode(to, code string) error {
	subject := "VAPIV 验证码"
	body := fmt.Sprintf("您的验证码是: %s\n\n验证码5分钟内有效，请勿泄露给他人。", code)
	return s.send(to, subject, body)
}

func (s *Service) send(to, subject, body string) error {
	auth := smtp.PlainAuth("", s.username, s.password, s.host)
	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n%s",
		s.from, to, subject, body)
	addr := fmt.Sprintf("%s:%d", s.host, s.port)
	return smtp.SendMail(addr, auth, s.from, []string{to}, []byte(msg))
}
