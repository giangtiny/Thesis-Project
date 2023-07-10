package controllers

import (
	"encoding/json"
	"github.com/beego/beego/v2/server/web"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"strings"
	"trebooking/models"
	"trebooking/services/fileio"
	"trebooking/utils"
)

type NewsController struct {
	web.Controller
}

// GetAllNews @Title GetAllNews
// @Description Get all news from database
// @Success 200
// @router /news/all [get]
func (n *NewsController) GetAllNews() {
	news, err := models.GetAllNews()
	if err != nil {
		n.CustomAbort(500, err.Error())
	}
	if news == nil {
		n.Data["json"] = make([]string, 0)
	} else {
		n.Data["json"] = news
	}
	if err = n.ServeJSON(); err != nil {
		n.Abort(utils.HotelState[500])
	}
}

// GetNewsByID @Title GetNewsByID
// @Description Get news by news ID
// @Param id path string true "id of news"
// @Success 200
// @router /news/:id [get]
func (n *NewsController) GetNewsByID() {
	newsID := n.GetString(":id")

	if isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(newsID),
	); !isValid {
		n.Ctx.Output.Header("Content-Type", "application/json")
		n.CustomAbort(400, strings.Join(msg, ""))
	}

	objNewsID, _ := primitive.ObjectIDFromHex(newsID)

	news, err := models.GetNewsByID(objNewsID)
	if err != nil {
		n.CustomAbort(500, err.Error())
	}

	n.Data["json"] = news
	if err = n.ServeJSON(); err != nil {
		n.CustomAbort(500, err.Error())
	}
}

// AddNews @Title AddNews
// @Description Create new news
// @Success 200
// @router /news [post]
func (n *NewsController) AddNews() {
	//token := h.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	//if err != nil {
	//	h.Abort("Error")
	//}
	//if !check {
	//	h.CustomAbort(401, "Permission denied")
	//}

	//body := n.Ctx.Input.RequestBody

	file := n.Ctx.Request.MultipartForm.File["thumbnail"]
	newsRq := n.Ctx.Request.MultipartForm.Value["news"]

	combinedString := strings.Join(newsRq, "")
	byteSlice := []byte(combinedString)

	var news models.News
	if err := json.Unmarshal(byteSlice, &news); err != nil {
		n.CustomAbort(400, err.Error())
	}

	result, err := models.CreateNews(news)
	if err != nil {
		n.CustomAbort(500, err.Error())
	}

	if file != nil {
		if err = fileio.UploadImages(&file); err != nil {
			n.CustomAbort(400, err.Error())
		}

		newsID := result.ID.Hex()
		if err := models.AddThumbnailsNews(newsID, file, "thumbnail"); err != nil {
			n.CustomAbort(400, err.Error())
		}
	}

	n.Data["json"] = result.ID
	if err := n.ServeJSON(); err != nil {
		n.CustomAbort(500, err.Error())
	}
	//n.CustomAbort(200, "Create news successfully")
}

// EditNews @Title EditNews
// @Description Edit information of news
// @Param id path string true "id of news"
// @Success 200
// @router /news/:id [put]
func (n *NewsController) EditNews() {

	//token := h.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	//if err != nil {
	//	h.Abort("Error")
	//}
	//if !check {
	//	h.CustomAbort(401, "Permission denied")
	//}

	newsID := n.GetString(":id")
	if isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(newsID),
	); !isValid {
		n.Ctx.Output.Header("Content-Type", "application/json")
		n.CustomAbort(400, strings.Join(msg, ""))
	}

	objNewsID, _ := primitive.ObjectIDFromHex(newsID)
	//body := n.Ctx.Input.RequestBody

	file := n.Ctx.Request.MultipartForm.File["thumbnail"]
	newsRq := n.Ctx.Request.MultipartForm.Value["news"]
	combinedString := strings.Join(newsRq, "")
	byteSlice := []byte(combinedString)

	var news models.News
	if err := json.Unmarshal(byteSlice, &news); err != nil {
		n.CustomAbort(400, err.Error())
	}

	err := models.UpdateNews(objNewsID, news)
	if err != nil {
		n.CustomAbort(404, err.Error())
	}

	if file != nil {
		news, err := models.GetNews(objNewsID)
		if err != nil {
			n.CustomAbort(500, err.Error())
		}
		if news.Thumbnail != "" {
			if err := fileio.RemoveImage(news.Thumbnail); err != nil {
				n.CustomAbort(400, err.Error())
			}
			if err := models.RemoveThumbnailNews(newsID, news.Thumbnail, "thumbnail"); err != nil {
				n.CustomAbort(400, err.Error())
			}
		}
		if err = fileio.UploadImages(&file); err != nil {
			n.CustomAbort(400, err.Error())
		}
		if err := models.AddThumbnailsNews(newsID, file, "thumbnail"); err != nil {
			n.CustomAbort(400, err.Error())
		}
	}

	n.Data["json"] = "Update news successfully"
	if err := n.ServeJSON(); err != nil {
		n.CustomAbort(500, err.Error())
	}
}

// DeleteNews @Title DeleteNews
// @Description Delete news by ID
// @Param id path string true "id of news"
// @Success 200
// @router /news/:id [delete]
func (n *NewsController) DeleteNews() {
	//token := h.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	//if err != nil {
	//	h.Abort("Error")
	//}
	//if !check {
	//	h.CustomAbort(401, "Permission denied")
	//}

	newsID := n.GetString(":id")
	if isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(newsID),
	); !isValid {
		n.Ctx.Output.Header("Content-Type", "application/json")
		n.CustomAbort(400, strings.Join(msg, ""))
	}

	if err := models.DeleteNews(newsID); err != nil {
		n.CustomAbort(404, err.Error())
	}
	n.Data["json"] = "Successfully deleted 1 news"
	if err := n.ServeJSON(); err != nil {
		n.CustomAbort(500, err.Error())
	}
}

// GetPagedNews @Title GetPagedNews
// @Description Get paged news
// @Success 200
// @router /news/paged [get]
func (n *NewsController) GetPagedNews() {
	offset, eOffset := n.GetInt64("offset")
	maxPerPage, eMaxPerPage := n.GetInt64("maxPerPage")
	if eOffset != nil || eMaxPerPage != nil {
		offset = 0
		maxPerPage = 12
	}
	news, err := models.GetPagedNews(offset, maxPerPage)
	if err != nil {
		n.CustomAbort(404, err.Error())
	}

	if news != nil {
		n.Data["json"] = news

	} else {
		n.Data["json"] = make([]string, 0)
	}
	if err := n.ServeJSON(); err != nil {
		n.CustomAbort(500, err.Error())
	}
}

// AddThumbnailsNews @Title AddThumbnailsNews
// @Description Upload new thumbnails
// @Success 200
// @router /news/thumbnail/:id [post]
func (n *NewsController) AddThumbnailsNews() {
	// token := h.Ctx.Request.Header.Get("Authorization")
	// check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff})
	// if err != nil {
	// 	h.Abort(err.Error())
	// }
	// if !check {
	// 	h.CustomAbort(401, "Permission denied")
	// }
	newsID := n.GetString(":id")
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(newsID),
	)
	if !isValid {
		n.Ctx.Output.Header("Content-Type", "application/json")
		n.CustomAbort(400, strings.Join(msg, ""))
	}
	file := n.Ctx.Request.MultipartForm.File["thumbnail"]
	if err := fileio.UploadImages(&file); err != nil {
		n.CustomAbort(400, err.Error())
	}
	if err := models.AddThumbnailsNews(newsID, file, "thumbnail"); err != nil {
		n.CustomAbort(400, err.Error())
	}
	n.CustomAbort(200, "Success")
}

// RemoveThumbnailNews @Title RemoveThumbnailNews
// @Description RemoveThumbnailNews
// @Success 200
// @router /news/thumbnail/delete/:id [post]
func (n *NewsController) RemoveThumbnailNews() {
	//token := h.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff})
	//if err != nil {
	//	h.Abort(err.Error())
	//}
	//if !check {
	//	h.CustomAbort(401, "Permission denied")
	//}

	newsID := n.GetString(":id")
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(newsID),
	)
	if !isValid {
		n.Ctx.Output.Header("Content-Type", "application/json")
		n.CustomAbort(400, strings.Join(msg, ""))
	}
	var inp = make(map[string][]string)
	if err := json.Unmarshal(n.Ctx.Input.RequestBody, &inp); err != nil {
		n.CustomAbort(400, err.Error())
	}
	thumbnailsName := inp["name"]
	if err := fileio.RemoveImages(thumbnailsName); err != nil {
		n.CustomAbort(400, err.Error())
	}
	if err := models.RemoveThumbnailsNews(newsID, thumbnailsName, "thumbnail"); err != nil {
		n.CustomAbort(400, err.Error())
	}
	n.CustomAbort(200, "Success")
}
