package controllers

import (
	"encoding/json"
	"strings"
	"trebooking/models"
	"trebooking/utils"

	"github.com/beego/beego/v2/server/web"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// AmenityController operations for Amenity
type AmenityController struct {
	web.Controller
}

// GetAll ...
// @Title Get All
// @Description get all amenities in database
// @Success 200
// @router /amenity/all [get]
func (a *AmenityController) GetAll() {
	amenities, err := models.GetAllAmenity()
	if err != nil {
		a.CustomAbort(500, err.Error())
	}
	if amenities == nil {
		a.Data["json"] = "No amenities found!"
	} else {
		a.Data["json"] = amenities
	}
	if err := a.ServeJSON(); err != nil {
		a.Abort(utils.HotelState[500])
	}
}

// GetAccommodationAmenities ...
// @Title Get accommodation amenities
// @Description Get all amenities of specific hotel/villa/townhouse
// @Success 200
// @router /amenity/accommodation/ [get]
func (a *AmenityController) GetAccommodationAmenities() {
	accommodationType := a.GetString("accommodationType")
	if accommodationType == "" {
		a.CustomAbort(400, utils.HotelState[400])
	}

	id := a.GetString("id")
	if id == "" {
		a.CustomAbort(400, utils.HotelState[400])
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(id),
	)
	if !isValid {
		a.Ctx.Output.Header("Content-Type", "application/json")
		a.CustomAbort(400, strings.Join(msg, ""))
	}

	amenities, err := models.GetAccommodationAmenities(id, accommodationType)
	if err != nil {
		a.CustomAbort(500, err.Error())
	}
	if amenities == nil {
		a.Data["json"] = "No amenities found!"
	} else {
		a.Data["json"] = amenities
	}
	if err := a.ServeJSON(); err != nil {
		a.Abort(utils.HotelState[500])
	}
}

// Post ...
// @Title Add amenity
// @Description create Amenity
// @Param	body		body 	models.Amenity	true		"body for Amenity content"
// @Success 200
// @router /amenity [post]
func (a *AmenityController) Add() {
	body := a.Ctx.Input.RequestBody
	var amenity models.Amenity
	if err := json.Unmarshal(body, &amenity); err != nil {
		a.CustomAbort(400, err.Error())
	}

	result, err := models.AddAmenity(amenity)
	if err != nil {
		a.CustomAbort(500, err.Error())
	}
	a.Data["json"] = result
	if err := a.ServeJSON(); err != nil {
		a.CustomAbort(500, err.Error())
	}
}

// Put ...
// @Title Put
// @Description update the Amenity
// @Param	id		path 	string	true		"The id you want to update"
// @Param	body		body 	models.Amenity	true		"body for Amenity content"
// @Success 200 {object} models.Amenity
// @router /amenity/:id [put]
func (a *AmenityController) Edit() {
	amenityId := a.GetString("id")
	if isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(amenityId),
	); !isValid {
		a.Ctx.Output.Header("Content-Type", "application/json")
		a.CustomAbort(400, strings.Join(msg, ""))
	}

	objAmenityId, _ := primitive.ObjectIDFromHex(amenityId)
	body := a.Ctx.Input.RequestBody
	var amenity models.Amenity
	if err := json.Unmarshal(body, &amenity); err != nil {
		a.CustomAbort(400, err.Error())
	}

	err := models.UpdateAmenity(objAmenityId, amenity)
	if err != nil {
		a.CustomAbort(404, err.Error())
	}

	a.Data["json"] = "Update amenity successfully"
	if err := a.ServeJSON(); err != nil {
		a.CustomAbort(500, err.Error())
	}
}

// Delete ...
// @Title Delete
// @Description delete the Amenity
// @Param	id		path 	string	true		"The id you want to delete"
// @Success 200 {string} delete amenity success!
// @router /amenity/:id [delete]
func (a *AmenityController) Delete() {
	amenityId := a.GetString("id")
	if isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(amenityId),
	); !isValid {
		a.Ctx.Output.Header("Content-Type", "application/json")
		a.CustomAbort(400, strings.Join(msg, ""))
	}

	objAmenityId, _ := primitive.ObjectIDFromHex(amenityId)
	if err := models.DeleteAmenity(objAmenityId); err != nil {
		a.CustomAbort(404, err.Error())
	}
	a.Data["json"] = "Delete amenity success!"
	if err := a.ServeJSON(); err != nil {
		a.CustomAbort(500, err.Error())
	}
}

// DeleteAccommodationAmenity ...
// @Title Delete accommodation amenity
// @Description delete a Amenity from hotel/villa/townhouse
// @Success 200 {string} delete amenity success!
// @router /amenity/accommodation/ [delete]
func (a *AmenityController) DeleteAccommodationAmenity() {
	description := a.GetString("description")
	icon := a.GetString("icon")
	accommodationType := a.GetString("accommodationType")
	if description == "" {
		a.CustomAbort(400, utils.HotelState[400])
	}
	if icon == "" {
		a.CustomAbort(400, utils.HotelState[400])
	}
	if accommodationType == "" {
		a.CustomAbort(400, utils.HotelState[400])
	}

	id := a.GetString("id")
	if id == "" {
		a.CustomAbort(400, utils.HotelState[400])
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(id),
	)
	if !isValid {
		a.Ctx.Output.Header("Content-Type", "application/json")
		a.CustomAbort(400, strings.Join(msg, ""))
	}

	var amenity models.Amenity
	amenity.Description = description
	amenity.Icon = icon
	if err := models.DeleteAccommodationAmenity(id, accommodationType, amenity); err != nil {
		a.CustomAbort(404, err.Error())
	}
	a.Data["json"] = "Delete amenity success!"
	if err := a.ServeJSON(); err != nil {
		a.CustomAbort(500, err.Error())
	}
}

// AddAccommodationAmenities @Title Add accommodation amenities
// @Description Upload amenities to hotel/villa/townhouse
// @Success 200
// @router /amenity/accommodation/ [post]
func (a *AmenityController) AddAccommodationAmenity() {
	accommodationType := a.GetString("accommodationType")
	if accommodationType == "" {
		a.CustomAbort(400, utils.HotelState[400])
	}

	id := a.GetString("id")
	if id == "" {
		a.CustomAbort(400, utils.HotelState[400])
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(id),
	)
	if !isValid {
		a.Ctx.Output.Header("Content-Type", "application/json")
		a.CustomAbort(400, strings.Join(msg, ""))
	}

	reqAmenity := a.Ctx.Input.RequestBody
	var amenity models.Amenity
	if err := json.Unmarshal(reqAmenity, &amenity); err != nil {
		a.CustomAbort(400, err.Error())
	}
	if err := models.AddAccommodationAmenity(id, accommodationType, amenity); err != nil {
		a.CustomAbort(400, err.Error())
	}
	a.CustomAbort(200, "Success")
}

// // AddRoomAmenities @Title Add room amenities
// // @Description Upload amenities to room
// // @Success 200
// // @router /room/amenities/:id [post]
// func (a *AmenityController) AddRoomAmenities() {
// 	roomID := a.GetString(":id")
// 	isValid, msg := utils.ValidateAPI(
// 		utils.ValidateObjectID(roomID),
// 	)
// 	if !isValid {
// 		a.Ctx.Output.Header("Content-Type", "application/json")
// 		a.CustomAbort(400, strings.Join(msg, ""))
// 	}

// 	reqAmenities := a.Ctx.Input.RequestBody
// 	var amenities []models.Amenity
// 	if err := json.Unmarshal(reqAmenities, &amenities); err != nil {
// 		a.CustomAbort(400, err.Error())
// 	}
// 	if err := models.AddRoomAmenities(roomID, amenities); err != nil {
// 		a.CustomAbort(400, err.Error())
// 	}
// 	a.CustomAbort(200, "Success")
// }
