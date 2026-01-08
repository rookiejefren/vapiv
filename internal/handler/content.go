package handler

import (
	"strconv"

	"vapiv/internal/service/content"
	"vapiv/pkg/response"

	"github.com/gin-gonic/gin"
)

type ContentHandler struct {
	biliSvc *content.BilibiliService
	qqSvc   *content.QQService
}

func NewContentHandler() *ContentHandler {
	return &ContentHandler{
		biliSvc: content.NewBilibiliService(),
		qqSvc:   content.NewQQService(),
	}
}

// BilibiliVideo godoc
// @Summary B站视频信息
// @Tags 内容数据
// @Param bvid query string true "视频BV号"
// @Success 200 {object} response.Response
// @Router /api/bilibili/video [get]
func (h *ContentHandler) BilibiliVideo(c *gin.Context) {
	bvid := c.Query("bvid")
	if bvid == "" {
		response.BadRequest(c, "bvid is required")
		return
	}

	info, err := h.biliSvc.GetVideoInfo(bvid)
	if err != nil {
		response.Error(c, 500, err.Error())
		return
	}
	response.Success(c, info)
}

// QQAvatar godoc
// @Summary QQ头像获取
// @Tags 内容数据
// @Param qq query string true "QQ号"
// @Param size query int false "头像尺寸"
// @Success 200 {object} response.Response
// @Router /api/qq/avatar [get]
func (h *ContentHandler) QQAvatar(c *gin.Context) {
	qq := c.Query("qq")
	if qq == "" {
		response.BadRequest(c, "qq is required")
		return
	}

	size, _ := strconv.Atoi(c.DefaultQuery("size", "100"))
	response.Success(c, h.qqSvc.GetAvatar(qq, size))
}
