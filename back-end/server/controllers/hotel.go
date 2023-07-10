package controllers

import (
	"encoding/json"
	"strings"
	"trebooking/jwt"
	"trebooking/models"
	"trebooking/services/fileio"
	"trebooking/utils"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/beego/beego/v2/server/web"
)

type HotelController struct {
	web.Controller
}

// GetAll @Title GetAll
// @Description Get all hotels from database
// @Success 200
// @router /hotel/all [get]
func (h *HotelController) GetAll() {
	hotels, err := models.GetAllHotel()
	if err != nil {
		h.CustomAbort(500, err.Error())
	}
	if hotels == nil {
		h.Data["json"] = make([]string, 0)
	} else {
		h.Data["json"] = hotels
	}
	if err = h.ServeJSON(); err != nil {
		h.Abort(utils.HotelState[500])
	}
}

// GetByID @Title Get hotel by id
// @Description Get hotel by hotel ID
// @Param id path string true "Id of Hotel"
// @Success 200
// @router /hotel/:id [get]
func (h *HotelController) GetByID() {
	hotelID := h.GetString(":id")

	if isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(hotelID),
	); !isValid {
		h.Ctx.Output.Header("Content-Type", "application/json")
		h.CustomAbort(400, strings.Join(msg, ""))
	}

	objHotelID, _ := primitive.ObjectIDFromHex(hotelID)

	hotel, err := models.GetHotelById(objHotelID)
	if err != nil {
		h.CustomAbort(500, err.Error())
	}

	h.Data["json"] = hotel
	if err = h.ServeJSON(); err != nil {
		h.CustomAbort(500, err.Error())
	}
}

// GetByOwner @Title GetByOwner
// @Param id path string true "Id of Hotel"
// @Success 200
// @router /hotel/owner [get]
func (h *HotelController) GetByOwner() {
	token := h.Ctx.Request.Header.Get("Authorization")

	tokenSplit := strings.Split(token, " ")
	if len(tokenSplit) < 2 {
		h.CustomAbort(500, "Token is invalid")
	}
	tokenString := tokenSplit[1]

	ownerID, err := jwt.GetIdOfAccount(tokenString)
	if err != nil {
		h.CustomAbort(500, err.Error())
	}

	objOwner, err := primitive.ObjectIDFromHex(ownerID)
	if err != nil {
		h.CustomAbort(400, err.Error())
	}

	hotel, err := models.GetHotelsByOwner(objOwner)
	if err != nil {
		h.CustomAbort(500, err.Error())
	}

	h.Data["json"] = hotel
	if err = h.ServeJSON(); err != nil {
		h.CustomAbort(500, err.Error())
	}
}

// Add @Title Add hotel
// @Description Create new hotel
// @Param hotel body models.CreateHotelDTO true "Create new hotel"
// @Success 200
// @router /hotel [post]
func (h *HotelController) Add() {
	//token := h.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	//if err != nil {
	//	h.Abort("Error")
	//}
	//if !check {
	//	h.CustomAbort(401, "Permission denied")
	//}

	body := h.Ctx.Input.RequestBody
	var hotel models.Hotel
	if err := json.Unmarshal(body, &hotel); err != nil {
		h.CustomAbort(400, err.Error())
	}

	result, err := models.CreateHotel(hotel)
	if err != nil {
		h.CustomAbort(500, err.Error())
	}
	h.Data["json"] = result
	if err := h.ServeJSON(); err != nil {
		h.CustomAbort(500, err.Error())
	}
}

// Edit @Title Edit hotel
// @Description Edit information of hotel
// @Param id path string true "Id of hotel"
// @Success 200
// @router /hotel/:id [put]
func (h *HotelController) Edit() {

	//token := h.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	//if err != nil {
	//	h.Abort("Error")
	//}
	//if !check {
	//	h.CustomAbort(401, "Permission denied")
	//}

	hotelID := h.GetString(":id")
	if isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(hotelID),
	); !isValid {
		h.Ctx.Output.Header("Content-Type", "application/json")
		h.CustomAbort(400, strings.Join(msg, ""))
	}

	objHotelID, _ := primitive.ObjectIDFromHex(hotelID)
	body := h.Ctx.Input.RequestBody
	var hotel models.Hotel
	if err := json.Unmarshal(body, &hotel); err != nil {
		h.CustomAbort(400, err.Error())
	}

	err := models.UpdateHotel(objHotelID, hotel)

	if err != nil {
		h.CustomAbort(404, err.Error())
	}

	h.Data["json"] = "Update hotel successfully"
	if err := h.ServeJSON(); err != nil {
		h.CustomAbort(500, err.Error())
	}
}

// Delete @Title Delete hotel
// @Description Delete hotel by ID
// @Param id path string true "Id of hotel"
// @Success 200
// @router /hotel/:id [delete]
func (h *HotelController) Delete() {

	//token := h.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	//if err != nil {
	//	h.Abort("Error")
	//}
	//if !check {
	//	h.CustomAbort(401, "Permission denied")
	//}

	hotelID := h.GetString(":id")
	if isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(hotelID),
	); !isValid {
		h.Ctx.Output.Header("Content-Type", "application/json")
		h.CustomAbort(400, strings.Join(msg, ""))
	}

	if err := models.DeleteHotel(hotelID); err != nil {
		h.CustomAbort(404, err.Error())
	}
	h.Data["json"] = "Successfully deleted 1 hotel"
	if err := h.ServeJSON(); err != nil {
		h.CustomAbort(500, err.Error())
	}
}

// GetPagedHotel @Title GetPagedHotel
// @Description Get paged hotel
// @Success 200
// @router /hotel/paged [get]
func (h *HotelController) GetPagedHotel() {
	offset, eOffset := h.GetInt64("offset")
	maxPerPage, eMaxPerPage := h.GetInt64("maxPerPage")
	if eOffset != nil || eMaxPerPage != nil {
		offset = 0
		maxPerPage = 12
	}
	hotels, err := models.GetPagedHotel(offset, maxPerPage)
	if err != nil {
		h.CustomAbort(404, err.Error())
	}

	if hotels != nil {
		h.Data["json"] = hotels

	} else {
		h.Data["json"] = make([]string, 0)
	}
	if err := h.ServeJSON(); err != nil {
		h.CustomAbort(500, err.Error())
	}
}

// GetAvailableHotels @Title Get available hotels
// @Description Get available hotels in time range from calendar and address match client's search term
// @Param address query string true "Searching address"
// @Param checkIn query string true "Check in time"
// @Param checkOut query string true "Check out time"
// @Success 200
// @router /hotel/available [get]
func (h *HotelController) GetAvailableHotels() {
	searchAddress := h.GetString("address")
	checkin := h.GetString("checkIn")
	checkout := h.GetString("checkOut")
	maxGuest, err := h.GetUint8("maxGuest")

	if err != nil {
		message := "Invalid field MaxGuest"
		h.CustomAbort(400, message)
	}
	if strings.TrimSpace(searchAddress) == "" {
		message := "Search term can not be empty"
		h.CustomAbort(400, message)
	}

	result, err := models.GetAvailableHotels(searchAddress, checkin, checkout, maxGuest)
	if err != nil {
		h.CustomAbort(400, "something went wrong")
	}

	if len(result) <= 0 {
		h.Data["json"] = "No available hotels"
	} else {
		h.Data["json"] = result
	}
	if err = h.ServeJSON(); err != nil {
		h.Abort(utils.HotelState[500])
	}
}

// GetAvailableRooms @Title Get available rooms
// @Description Get available rooms in time range from calendar
// @Param hotelID query string true "ID of hotel to get rooms"
// @Param checkIn query string true "Check in time"
// @Param checkOut query string true "Check out time"
// @Success 200
// @router /hotel/room/available [get]
func (h *HotelController) GetAvailableRooms() {
	hotelID := h.GetString("hotelID")
	checkIn := h.GetString("checkIn")
	checkOut := h.GetString("checkOut")

	bodyJson := []byte(`{"hotelID": "` + hotelID + `", "from": "` + checkIn + `", "to": "` + checkOut + `"}`)
	var requestAvailableRoom models.RequestAvailableRoom
	if err := json.Unmarshal(bodyJson, &requestAvailableRoom); err != nil {
		h.CustomAbort(400, err.Error())
	}

	isValid, msg := utils.ValidateAPI(
		utils.ValidateCheckInCheckOutTime(requestAvailableRoom.From, requestAvailableRoom.To),
	)
	if !isValid {
		h.Ctx.Output.Header("Content-Type", "application/json")
		h.CustomAbort(400, strings.Join(msg, ""))
	}

	availableRooms, err := models.GetAvailableRooms(requestAvailableRoom)
	if err != nil {
		h.CustomAbort(400, err.Error())
	}

	h.Data["json"] = availableRooms
	if err = h.ServeJSON(); err != nil {
		h.Abort(utils.HotelState[500])
	}
}

// GetAvailableHotelsByFilter @Title Get available hotels by filter
// @Description Get available hotels match filter
// @Param address query string true "Searching address"
// @Param checkIn query string true "Check in time"
// @Param checkOut query string true "Check out time"
// @Success 200
// @router /hotel/available/filter [post]
func (h *HotelController) GetAvailableHotelsByFilter() {
	searchAddress := h.GetString("address")
	checkin := h.GetString("checkIn")
	checkout := h.GetString("checkOut")
	maxGuest, err := h.GetUint8("maxGuest")

	body := h.Ctx.Input.RequestBody
	var filter models.Filter

	if err != nil {
		message := "Invalid field MaxGuest"
		h.CustomAbort(400, message)
	}
	if strings.TrimSpace(searchAddress) == "" {
		message := "Search term can not be empty"
		h.CustomAbort(400, message)
	}
	if err := json.Unmarshal(body, &filter); err != nil {
		h.CustomAbort(400, "something went wrong")
	}

	result, err := models.GetAvailableHotelsByFilter(searchAddress, checkin, checkout, maxGuest, filter)
	if err != nil {
		h.CustomAbort(400, err.Error())
	}

	if len(result) <= 0 {
		h.Data["json"] = "No available hotels"
	} else {
		h.Data["json"] = result
	}
	if err = h.ServeJSON(); err != nil {
		h.Abort(utils.HotelState[500])
	}
}

// AddImagesHotel @Title Upload image
// @Description Upload new image
// @Success 200
// @router /hotel/:images/:id [post]
func (h *HotelController) AddImagesHotel() {
	// token := h.Ctx.Request.Header.Get("Authorization")
	// check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff})
	// if err != nil {
	// 	h.Abort(err.Error())
	// }
	// if !check {
	// 	h.CustomAbort(401, "Permission denied")
	// }
	hotelID := h.GetString(":id")
	typeImage := h.GetString(":images")
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(hotelID),
	)
	if !isValid {
		h.Ctx.Output.Header("Content-Type", "application/json")
		h.CustomAbort(400, strings.Join(msg, ""))
	}
	files := h.Ctx.Request.MultipartForm.File[typeImage]
	if err := fileio.UploadImages(&files); err != nil {
		h.CustomAbort(400, err.Error())
	}
	if err := models.AddImagesHotel(hotelID, files, typeImage); err != nil {
		h.CustomAbort(400, err.Error())
	}
	h.CustomAbort(200, "Success")
}

// RemoveImagesHotel @Title Upload image
// @Description Remove image of hotel
// @Success 200
// @router /hotel/:images/delete/:id [post]
func (h *HotelController) RemoveImagesHotel() {
	//token := h.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff})
	//if err != nil {
	//	h.Abort(err.Error())
	//}
	//if !check {
	//	h.CustomAbort(401, "Permission denied")
	//}
	hotelID := h.GetString(":id")
	typeImage := h.GetString(":images")
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(hotelID),
	)
	if !isValid {
		h.Ctx.Output.Header("Content-Type", "application/json")
		h.CustomAbort(400, strings.Join(msg, ""))
	}
	var inp = make(map[string][]string)
	if err := json.Unmarshal(h.Ctx.Input.RequestBody, &inp); err != nil {
		h.CustomAbort(400, err.Error())
	}
	imageNames := inp["name"]
	if err := fileio.RemoveImages(imageNames); err != nil {
		h.CustomAbort(400, err.Error())
	}
	if err := models.RemoveImagesHotel(hotelID, imageNames, typeImage); err != nil {
		h.CustomAbort(400, err.Error())
	}
	h.CustomAbort(200, "Success")
}
