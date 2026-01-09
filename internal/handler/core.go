package handler

import (
	"vapiv/internal/service/core"
	"vapiv/pkg/response"

	"github.com/gin-gonic/gin"
)

type CoreHandler struct {
	ipSvc     *core.IPService
	cryptoSvc *core.CryptoService
	douyinSvc *core.DouyinService
}

func NewCoreHandler() *CoreHandler {
	return &CoreHandler{
		ipSvc:     core.NewIPService(),
		cryptoSvc: core.NewCryptoService(),
		douyinSvc: core.NewDouyinService(),
	}
}

// IPQuery godoc
// @Summary IP地址查询
// @Tags 核心服务
// @Param ip query string false "IP地址"
// @Success 200 {object} response.Response
// @Router /api/ip [get]
func (h *CoreHandler) IPQuery(c *gin.Context) {
	ip := c.DefaultQuery("ip", c.ClientIP())
	info, err := h.ipSvc.Query(ip)
	if err != nil {
		response.Error(c, 500, err.Error())
		return
	}
	response.Success(c, info)
}
