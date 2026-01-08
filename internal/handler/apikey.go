package handler

import (
	"strconv"

	"vapiv/internal/service/user"
	"vapiv/pkg/response"

	"github.com/gin-gonic/gin"
)

type APIKeyHandler struct {
	svc *user.Service
}

func NewAPIKeyHandler(svc *user.Service) *APIKeyHandler {
	return &APIKeyHandler{svc: svc}
}

func (h *APIKeyHandler) Create(c *gin.Context) {
	userID := c.GetUint("user_id")
	name := c.DefaultQuery("name", "default")

	key, err := h.svc.CreateAPIKey(userID, name)
	if err != nil {
		response.Error(c, 500, err.Error())
		return
	}
	response.Success(c, key)
}

func (h *APIKeyHandler) List(c *gin.Context) {
	userID := c.GetUint("user_id")
	keys, err := h.svc.ListAPIKeys(userID)
	if err != nil {
		response.Error(c, 500, err.Error())
		return
	}
	response.Success(c, keys)
}

func (h *APIKeyHandler) Delete(c *gin.Context) {
	userID := c.GetUint("user_id")
	keyID, _ := strconv.ParseUint(c.Param("id"), 10, 32)

	if err := h.svc.DeleteAPIKey(userID, uint(keyID)); err != nil {
		response.Error(c, 500, err.Error())
		return
	}
	response.Success(c, nil)
}
