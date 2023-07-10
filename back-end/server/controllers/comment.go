package controllers

import (
	"encoding/json"
	"trebooking/models"
	"trebooking/utils"

	"github.com/beego/beego/v2/server/web"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CommentController struct {
	web.Controller
}

// GetAllDetailComment @Title Get
// @Description Get all comment with detail (reply)
// @Success 200
// @router /comment/all/detail [get]
func (c *CommentController) GetAllDetailComment() {
	accommodationID := c.GetString("id")
	if accommodationID == "" {
		c.CustomAbort(400, utils.HotelState[400])
	}

	hotelObjID, eHex := primitive.ObjectIDFromHex(accommodationID)
	if eHex != nil {
		c.CustomAbort(500, utils.HotelState[500])
		return
	}
	comments, err := models.GetAllDetailComment(hotelObjID)
	if err != nil {
		c.CustomAbort(500, utils.HotelState[500])
	}

	c.Data["json"] = comments
	err = c.ServeJSON()
	if err != nil {
		c.Abort(utils.HotelState[500])
	}
}

// GetPagedDetailComment @Title Get
// @Description get comment paged
// @Success 200
// @router /comment/paged/detail [get]
func (c *CommentController) GetPagedDetailComment() {
	offset, eOffset := c.GetInt64("offSet")
	maxPerPage, eMaxPerPage := c.GetInt64("maxPerPage")
	hotelID := c.GetString("id")

	if hotelID == "" {
		c.CustomAbort(400, utils.HotelState[400])
	}

	// Change to objectID
	hotelOBJID, eHex := primitive.ObjectIDFromHex(hotelID)
	if eHex != nil {
		c.CustomAbort(500, utils.HotelState[500])
		return
	}

	if eOffset != nil || eMaxPerPage != nil {
		offset = 1
		maxPerPage = 12
	}

	hotels, err := models.GetPagedDetailComment(hotelOBJID, offset, maxPerPage)

	if err != nil {
		c.CustomAbort(500, utils.HotelState[500])
		return
	}
	if hotels == nil {
		hotels = make([]models.Comment, 0)
	}
	c.Data["json"] = hotels
	err = c.ServeJSON()
	if err != nil {
		c.CustomAbort(500, utils.HotelState[500])
	}
}

// AddComment @Title Post
// @Description add new comment
// @Success 200
// @router /comment [post]
func (c *CommentController) Add() {
	body := c.Ctx.Input.RequestBody
	accommodationType := c.GetString("accommodationType")
	var comment models.Comment
	err := json.Unmarshal(body, &comment)
	if err != nil {
		c.CustomAbort(400, utils.HotelState[400])
		return
	}

	err = models.AddComment(comment, accommodationType)
	if err != nil {
		// c.CustomAbort(500, utils.HotelState[500])
		c.CustomAbort(500, err.Error())
		return
	}
	c.Data["json"] = "Successfully added comment"
	err = c.ServeJSON()
	if err != nil {
		c.Abort(utils.HotelState[500])
	}
}

// DeleteComment @Title Edit
// @Description Put
// @Param	id		path 	string	true		"The key for utils block"
// @Success 200
// @Failure 403 :id is empty
// @router /comment [delete]
func (c *CommentController) Delete() {
	commentID := c.GetString("id")
	level, _ := c.GetInt("level")

	if commentID == "" || level < 1 {
		c.CustomAbort(400, utils.HotelState[400])
	}

	commentObjID, eHex := primitive.ObjectIDFromHex(commentID)
	if eHex != nil {
		c.CustomAbort(500, utils.HotelState[500])
		return
	}

	if eHex != nil {
		c.CustomAbort(500, utils.HotelState[500])
		return
	}

	err := models.DeleteComment(commentObjID, level)
	if err != nil {
		c.CustomAbort(500, utils.HotelState[500])
		return
	}
	c.Data["json"] = "Delete successfully"
	err = c.ServeJSON()
	if err != nil {
		c.Abort(utils.HotelState[500])
	}
}

// UpdateComment @Title PUT
// @Description PUT
// @router /comment [put]
func (c *CommentController) Edit() {
	commentID := c.GetString("id")
	objID, err := primitive.ObjectIDFromHex(commentID)
	if err != nil {
		c.CustomAbort(400, utils.HotelState[400])
		return
	}
	body := c.Ctx.Input.RequestBody
	// body to bson
	var comment models.Comment
	err = json.Unmarshal(body, &comment)
	if err != nil {
		c.CustomAbort(400, utils.HotelState[400])
		return
	}

	err = models.UpdateComment(objID, comment)
	if err != nil {
		c.CustomAbort(500, utils.HotelState[500])
		return
	}

	c.Data["json"] = "update successfully"
	err = c.ServeJSON()
	if err != nil {
		c.Abort(utils.HotelState[500])
	}
}

// GetAllComment @Title GET
// @Description GET
// @router /comment/all [get]
func (c *CommentController) GetAllComment() {
	hotelID := c.GetString("id")
	// level, err := c.GetInt("level")
	// if err != nil {
	// 	c.CustomAbort(400, utils.HotelState[400])
	// }
	hotelObjID, eHotelID := primitive.ObjectIDFromHex(hotelID)
	if eHotelID != nil {
		c.CustomAbort(400, utils.HotelState[400])
		return
	}
	comments, err := models.GetAllComment(hotelObjID)
	if err != nil {
		c.CustomAbort(500, utils.HotelState[500])
		return
	}

	c.Data["json"] = comments
	err = c.ServeJSON()
	if err != nil {
		c.CustomAbort(500, utils.HotelState[500])
	}
}

// IsValidToAddComment @Title GET
// @Description check if a user is able to add comment or not
// @router /comment/valid [post]
func (c *CommentController) IsValidToAddComment() {
	body := c.Ctx.Input.RequestBody
	accommodationType := c.GetString("accommodationType")
	var comment models.Comment
	err := json.Unmarshal(body, &comment)
	if err != nil {
		c.CustomAbort(400, utils.HotelState[400])
		return
	}

	isValid := models.IsValidToAddComment(comment, accommodationType)

	c.Data["json"] = isValid
	err = c.ServeJSON()
	if err != nil {
		c.CustomAbort(500, utils.HotelState[500])
	}
}
