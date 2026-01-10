package handler

import (
	"vapiv/pkg/response"

	"github.com/gin-gonic/gin"
)

type CryptoReq struct {
	Text string `json:"text" binding:"required"`
	Key  string `json:"key" binding:"required"`
}

// AESEncrypt godoc
// @Summary AES加密
// @Tags 核心服务
// @Accept json
// @Param request body CryptoReq true "加密请求"
// @Success 200 {object} response.Response
// @Security ApiKeyAuth
// @Router /api/crypto/encrypt [post]
func (h *CoreHandler) AESEncrypt(c *gin.Context) {
	var req CryptoReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	result, err := h.cryptoSvc.AESEncrypt(req.Text, req.Key)
	if err != nil {
		response.Error(c, 500, err.Error())
		return
	}
	response.Success(c, gin.H{"encrypted": result})
}

// AESDecrypt godoc
// @Summary AES解密
// @Tags 核心服务
// @Accept json
// @Param request body CryptoReq true "解密请求"
// @Success 200 {object} response.Response
// @Security ApiKeyAuth
// @Router /api/crypto/decrypt [post]
func (h *CoreHandler) AESDecrypt(c *gin.Context) {
	var req CryptoReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	result, err := h.cryptoSvc.AESDecrypt(req.Text, req.Key)
	if err != nil {
		response.Error(c, 500, err.Error())
		return
	}
	response.Success(c, gin.H{"decrypted": result})
}
