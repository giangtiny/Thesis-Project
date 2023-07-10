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

type NewsContentController struct {
	web.Controller
}

// AddNewsContent @Title AddNewsContent
// @Description Create new news content
// @Success 200
// @router /newsContent/:id [post]
func (nc *NewsContentController) AddNewsContent() {
	//token := h.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	//if err != nil {
	//	h.Abort("Error")
	//}
	//if !check {
	//	h.CustomAbort(401, "Permission denied")
	//}

	newsID := nc.GetString(":id")
	file := nc.Ctx.Request.MultipartForm.File["image"]
	newsContentRq := nc.Ctx.Request.MultipartForm.Value["newsContent"]

	combinedString := strings.Join(newsContentRq, "")
	byteSlice := []byte(combinedString)

	var newsContent models.NewsContent
	if err := json.Unmarshal(byteSlice, &newsContent); err != nil {
		nc.CustomAbort(400, err.Error())
	}

	result, err := models.CreateNewsContent(newsContent, newsID)
	if err != nil {
		nc.CustomAbort(500, err.Error())
	}

	if file != nil {
		if err = fileio.UploadImages(&file); err != nil {
			nc.CustomAbort(400, err.Error())
		}
		newsContentID := result.ID.Hex()
		if err := models.AddImagesNewsContent(newsContentID, file, "image"); err != nil {
			nc.CustomAbort(400, err.Error())
		}
	}

	nc.Data["json"] = result.ID
	if err := nc.ServeJSON(); err != nil {
		nc.CustomAbort(500, err.Error())
	}
	//nc.CustomAbort(200, "Create news content successfully")
}

// EditNewsContent @Title EditNewsContent
// @Description Edit information of news content
// @Param id path string true "id of news content"
// @Success 200
// @router /newsContent/:id [put]
func (nc *NewsContentController) EditNewsContent() {

	//token := h.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	//if err != nil {
	//	h.Abort("Error")
	//}
	//if !check {
	//	h.CustomAbort(401, "Permission denied")
	//}

	newsContentID := nc.GetString(":id")
	if isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(newsContentID),
	); !isValid {
		nc.Ctx.Output.Header("Content-Type", "application/json")
		nc.CustomAbort(400, strings.Join(msg, ""))
	}

	objNewsContentID, _ := primitive.ObjectIDFromHex(newsContentID)
	//body := n.Ctx.Input.RequestBody

	file := nc.Ctx.Request.MultipartForm.File["image"]
	newsRq := nc.Ctx.Request.MultipartForm.Value["newsContent"]
	combinedString := strings.Join(newsRq, "")
	byteSlice := []byte(combinedString)
	var newsContent models.NewsContent

	if err := json.Unmarshal(byteSlice, &newsContent); err != nil {
		nc.CustomAbort(400, err.Error())
	}
	err := models.UpdateNewsContent(objNewsContentID, newsContent)

	if err != nil {
		nc.CustomAbort(404, err.Error())
	}

	if file != nil {
		newsContent, err := models.GetNewsContent(objNewsContentID)
		if err != nil {
			nc.CustomAbort(500, err.Error())
		}
		if newsContent.Image != "" {
			if err := fileio.RemoveImage(newsContent.Image); err != nil {
				nc.CustomAbort(400, err.Error())
			}
			if err := models.RemoveImageNewContent(newsContentID, newsContent.Image, "image"); err != nil {
				nc.CustomAbort(400, err.Error())
			}
		}
		if err = fileio.UploadImages(&file); err != nil {
			nc.CustomAbort(400, err.Error())
		}
		if err := models.AddImagesNewsContent(newsContentID, file, "image"); err != nil {
			nc.CustomAbort(400, err.Error())
		}
	}
	nc.Data["json"] = "Update news content successfully"
	if err := nc.ServeJSON(); err != nil {
		nc.CustomAbort(500, err.Error())
	}
}

// DeleteNewsContent @Title DeleteNewsContent
// @Description Delete news content by ID
// @Param id path string true "id of news content"
// @Success 200
// @router /newsContent/:id [delete]
func (nc *NewsContentController) DeleteNewsContent() {
	//token := h.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	//if err != nil {
	//	h.Abort("Error")
	//}
	//if !check {
	//	h.CustomAbort(401, "Permission denied")
	//}

	newsContentID := nc.GetString(":id")
	if isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(newsContentID),
	); !isValid {
		nc.Ctx.Output.Header("Content-Type", "application/json")
		nc.CustomAbort(400, strings.Join(msg, ""))
	}

	if err := models.DeleteNewsContent(newsContentID); err != nil {
		nc.CustomAbort(404, err.Error())
	}
	nc.Data["json"] = "Successfully deleted 1 news content"
	if err := nc.ServeJSON(); err != nil {
		nc.CustomAbort(500, err.Error())
	}
}

// AddImagesNewsContent @Title AddImagesNewsContent
// @Description Upload new image
// @Success 200
// @router /newsContent/image/:id [post]
func (nc *NewsContentController) AddImagesNewsContent() {
	// token := h.Ctx.Request.Header.Get("Authorization")
	// check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff})
	// if err != nil {
	// 	h.Abort(err.Error())
	// }
	// if !check {
	// 	h.CustomAbort(401, "Permission denied")
	// }
	newsID := nc.GetString(":id")
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(newsID),
	)
	if !isValid {
		nc.Ctx.Output.Header("Content-Type", "application/json")
		nc.CustomAbort(400, strings.Join(msg, ""))
	}
	file := nc.Ctx.Request.MultipartForm.File["image"]
	if err := fileio.UploadImages(&file); err != nil {
		nc.CustomAbort(400, err.Error())
	}
	if err := models.AddImagesNewsContent(newsID, file, "image"); err != nil {
		nc.CustomAbort(400, err.Error())
	}
	nc.CustomAbort(200, "Success")
}

// RemoveImageNewsContent @Title RemoveImageNewsContent
// @Description RemoveImageNewsContent
// @Success 200
// @router /newsContent/image/delete/:id [post]
func (nc *NewsContentController) RemoveImageNewsContent() {
	//token := h.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff})
	//if err != nil {
	//	h.Abort(err.Error())
	//}
	//if !check {
	//	h.CustomAbort(401, "Permission denied")
	//}

	newsContentID := nc.GetString(":id")
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(newsContentID),
	)
	if !isValid {
		nc.Ctx.Output.Header("Content-Type", "application/json")
		nc.CustomAbort(400, strings.Join(msg, ""))
	}
	var inp = make(map[string][]string)
	if err := json.Unmarshal(nc.Ctx.Input.RequestBody, &inp); err != nil {
		nc.CustomAbort(400, err.Error())
	}
	imagesName := inp["name"]
	if err := fileio.RemoveImages(imagesName); err != nil {
		nc.CustomAbort(400, err.Error())
	}
	if err := models.RemoveImagesNewsContent(newsContentID, imagesName, "image"); err != nil {
		nc.CustomAbort(400, err.Error())
	}
	nc.CustomAbort(200, "Success")
}
