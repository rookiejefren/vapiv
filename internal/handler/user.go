package handler

import (
	"vapiv/internal/service/user"
	"vapiv/pkg/response"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	svc *user.Service
}

func NewUserHandler(svc *user.Service) *UserHandler {
	return &UserHandler{svc: svc}
}

type RegisterReq struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginReq struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func (h *UserHandler) Register(c *gin.Context) {
	var req RegisterReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	u, err := h.svc.Register(req.Username, req.Email, req.Password)
	if err != nil {
		response.Error(c, 500, err.Error())
		return
	}
	response.Success(c, u)
}

func (h *UserHandler) Login(c *gin.Context) {
	var req LoginReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	token, err := h.svc.Login(req.Email, req.Password)
	if err != nil {
		response.Error(c, 401, err.Error())
		return
	}
	response.Success(c, gin.H{"token": token})
}
