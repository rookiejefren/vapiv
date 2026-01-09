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
	Code     string `json:"code" binding:"required,len=6"`
}

type LoginReq struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type SendCodeReq struct {
	Email   string `json:"email" binding:"required,email"`
	Purpose string `json:"purpose" binding:"required,oneof=register reset"`
}

type ResetPasswordReq struct {
	Email       string `json:"email" binding:"required,email"`
	Code        string `json:"code" binding:"required,len=6"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

// Register godoc
// @Summary 用户注册
// @Tags 认证
// @Param body body RegisterReq true "注册信息"
// @Success 200 {object} response.Response
// @Router /auth/register [post]
func (h *UserHandler) Register(c *gin.Context) {
	var req RegisterReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	if !h.svc.VerifyCode(req.Email, "register", req.Code) {
		response.BadRequest(c, "验证码错误或已过期")
		return
	}

	u, err := h.svc.Register(req.Username, req.Email, req.Password)
	if err != nil {
		response.Error(c, 500, err.Error())
		return
	}
	response.Success(c, u)
}

// Login godoc
// @Summary 用户登录
// @Tags 认证
// @Param body body LoginReq true "登录信息"
// @Success 200 {object} response.Response
// @Router /auth/login [post]
func (h *UserHandler) Login(c *gin.Context) {
	var req LoginReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	token, err := h.svc.Login(req.Username, req.Password)
	if err != nil {
		response.Error(c, 401, err.Error())
		return
	}
	response.Success(c, gin.H{"token": token})
}

// SendCode godoc
// @Summary 发送验证码
// @Tags 认证
// @Param body body SendCodeReq true "请求参数"
// @Success 200 {object} response.Response
// @Router /auth/send-code [post]
func (h *UserHandler) SendCode(c *gin.Context) {
	var req SendCodeReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	if req.Purpose == "register" && h.svc.EmailExists(req.Email) {
		response.BadRequest(c, "邮箱已被注册")
		return
	}
	if req.Purpose == "reset" && !h.svc.EmailExists(req.Email) {
		response.BadRequest(c, "邮箱不存在")
		return
	}

	if err := h.svc.SendCode(req.Email, req.Purpose); err != nil {
		response.Error(c, 500, "发送验证码失败: "+err.Error())
		return
	}
	response.Success(c, nil)
}

// ResetPassword godoc
// @Summary 重置密码
// @Tags 认证
// @Param body body ResetPasswordReq true "请求参数"
// @Success 200 {object} response.Response
// @Router /auth/reset-password [post]
func (h *UserHandler) ResetPassword(c *gin.Context) {
	var req ResetPasswordReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	if !h.svc.VerifyCode(req.Email, "reset", req.Code) {
		response.BadRequest(c, "验证码错误或已过期")
		return
	}

	if err := h.svc.ResetPassword(req.Email, req.NewPassword); err != nil {
		response.Error(c, 500, "重置密码失败")
		return
	}
	response.Success(c, nil)
}
