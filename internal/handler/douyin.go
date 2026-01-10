package handler

import (
	"vapiv/pkg/response"

	"github.com/gin-gonic/gin"
)

// DouyinVideo godoc
// @Summary 解析抖音视频
// @Description 通过抖音分享链接获取视频信息和无水印下载地址
// @Tags 核心服务
// @Accept json
// @Param url query string true "抖音分享链接"
// @Success 200 {object} response.Response
// @Security ApiKeyAuth
// @Router /api/douyin/video [get]
func (h *CoreHandler) DouyinVideo(c *gin.Context) {
	url := c.Query("url")
	if url == "" {
		response.BadRequest(c, "url参数不能为空")
		return
	}

	video, err := h.douyinSvc.ParseVideo(url)
	if err != nil {
		response.Error(c, 500, err.Error())
		return
	}

	response.Success(c, video)
}
