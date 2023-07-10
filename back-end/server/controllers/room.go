package controllers

import (
	"encoding/json"
	"trebooking/models"
	"trebooking/utils"

	"github.com/beego/beego/v2/server/web"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RoomController struct {
	web.Controller
}

// GetAllRoom @Title Get all room
// @Param hotelID query string true "Id of Hotel"
// @Description Get all room of hotel
// @Success 200
// @router /room/all [get]
func (r *RoomController) GetAllRoom() {
	hotelID := r.GetString("hotelID")
	hotelObjID, err := primitive.ObjectIDFromHex(hotelID)
	if err != nil {
		r.CustomAbort(400, "invalid hotel id")
	}
	rooms, err := models.GetAllRoom(hotelObjID)
	if err != nil {
		r.CustomAbort(500, err.Error())
	}
	if rooms == nil {
		r.Data["json"] = make([]string, 0)
	} else {
		r.Data["json"] = rooms
	}
	err = r.ServeJSON()
	if err != nil {
		r.Abort(utils.HotelState[500])
	}
}

// GetPagedRoom @Title GetPagedRoom
// @Description Get paged rooms of hotel
// @Success 200
// @router /room/paged [get]
func (r *RoomController) GetPagedRoom() {
	hotelID := r.GetString("hotelID")
	objHotelID, err := primitive.ObjectIDFromHex(hotelID)
	if err != nil {
		r.CustomAbort(400, "invalid hotel id")
	}
	offset, eOffset := r.GetInt64("offset")
	maxPerPage, eMaxPerPage := r.GetInt64("maxPerPage")
	if eOffset != nil || eMaxPerPage != nil {
		offset = 0
		maxPerPage = 12
	}
	rooms, err := models.GetPagedRoom(objHotelID, offset, maxPerPage)
	if err != nil {
		r.CustomAbort(404, err.Error())
	}
	if rooms == nil {
		r.Data["json"] = make([]string, 0)
	} else {
		r.Data["json"] = rooms
	}
	if err := r.ServeJSON(); err != nil {
		r.CustomAbort(500, err.Error())
	}

}

// SearchAllRooms @Title SearchAllRooms
// @Description Search all rooms of hotel
// @Success 200
// @router /room/search [get]
func (r *RoomController) SearchAllRooms() {
	hotelID := r.GetString("hotelID")
	search := r.GetString("search")
	objHotelID, err := primitive.ObjectIDFromHex(hotelID)

	if err != nil {
		r.CustomAbort(400, err.Error())
	}
	if search == "" {
		r.CustomAbort(400, "Input is invalid, search must be not empty")
	}
	rooms, err := models.SearchAllRoomAndStatus(objHotelID, search)
	if err != nil {
		r.CustomAbort(404, err.Error())
	}
	if rooms == nil {
		r.Data["json"] = make([]string, 0)
	} else {
		r.Data["json"] = rooms
	}
	if err := r.ServeJSON(); err != nil {
		r.CustomAbort(500, err.Error())
	}
}

// GetAllSpecialRoom @Title GetAllSpecialRoom
// @Param hotelID query string true "Id of Hotel"
// @Description Get all room of hotel
// @Success 200
// @router /room/all/special [get]
func (r *RoomController) GetAllSpecialRoom() {
	hotelID := r.GetString("hotelID")
	hotelObjID, err := primitive.ObjectIDFromHex(hotelID)
	if err != nil {
		r.CustomAbort(400, err.Error())
	}
	rooms, err := models.GetAllRoomAndStatus(hotelObjID)

	if err != nil {
		r.CustomAbort(500, err.Error())
	}

	if rooms == nil {
		r.Data["json"] = make([]string, 0)
	} else {
		r.Data["json"] = rooms
	}
	err = r.ServeJSON()
	if err != nil {
		r.Abort(utils.HotelState[500])
	}
}

// GetPagedSpecialRoom @Title GetPagedSpecialRoom
// @Description Get paged room with status
// @Success 200
// @router /room/paged/special [get]
func (r *RoomController) GetPagedSpecialRoom() {
	hotelID := r.GetString("hotelID")
	hotelObjID, err := primitive.ObjectIDFromHex(hotelID)

	offset, eOffset := r.GetInt64("offset")
	maxPerPage, eMaxPerPage := r.GetInt64("maxPerPage")
	if eOffset != nil || eMaxPerPage != nil {
		offset = 0
		maxPerPage = 12
	}
	if err != nil {
		r.CustomAbort(400, err.Error())
	}
	rooms, err := models.GetPagedRoomAndStatus(hotelObjID, offset, maxPerPage)

	if err != nil {
		r.CustomAbort(500, err.Error())
	}

	if rooms == nil {
		r.Data["json"] = make([]string, 0)
	} else {
		r.Data["json"] = rooms
	}
	err = r.ServeJSON()
	if err != nil {
		r.Abort(utils.HotelState[500])
	}
}

// AddRoom @Title Add new room
// @Description Create new room of hotel
// @Success 200
// @router /room [post]
func (r *RoomController) AddRoom() {
	//token := r.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.StaffHotel})
	//if err != nil {
	//	r.Abort("Error")
	//}
	//if !check {
	//	r.CustomAbort(401, utils.HotelState[401])
	//}

	body := r.Ctx.Input.RequestBody
	var room models.Room
	if err := json.Unmarshal(body, &room); err != nil {
		r.CustomAbort(400, utils.HotelState[400])
	}
	//if isValid, msg := utils.ValidateAPI(
	//	utils.ValidateRoomNo(room.RoomNo),
	//); !isValid {
	//	r.Ctx.Output.Header("Content-Type", "application/json")
	//	r.CustomAbort(400, strings.Join(msg, ""))
	//}

	result, err := models.CreatRoom(room)

	if err != nil {
		r.CustomAbort(400, err.Error())
		return
	}
	r.Data["json"] = result
	if err = r.ServeJSON(); err != nil {
		r.Abort(utils.HotelState[500])
	}
}

// DeleteRoom @Title Delete
// @Description DELETE
// @Param id path string true "Id of room"
// @Success 200
// @router /room/:id [delete]
func (r *RoomController) DeleteRoom() {
	//token := r.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	//if err != nil {
	//	r.Abort("Error")
	//}
	//if !check {
	//	r.CustomAbort(401, utils.HotelState[401])
	//}

	id := r.Ctx.Input.Param(":id")
	roomID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		r.CustomAbort(400, utils.HotelState[400])
	}
	err = models.DeleteRoom(roomID)
	if err != nil {
		r.CustomAbort(500, utils.HotelState[500])
	}
	r.Data["json"] = "Deleted successfully"
	err = r.ServeJSON()
	if err != nil {
		r.Abort(utils.HotelState[500])
	}
}

// EditRoom @Title Edit room
// @Description Edit room's information
// @Param id path string true "Id of room"
// @Param room body models.RoomProperties true "Update room information"
// @Success 200
// @router /room/:id [put]
func (r *RoomController) EditRoom() {
	//token := r.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.StaffHotel})
	//if err != nil {
	//	r.Abort("Error")
	//}
	//if !check {
	//	r.CustomAbort(401, utils.HotelState[401])
	//}

	id := r.Ctx.Input.Param(":id")
	roomID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		r.CustomAbort(400, utils.HotelState[400])
	}
	body := r.Ctx.Input.RequestBody
	var room models.Room
	err = json.Unmarshal(body, &room)
	if err != nil {
		r.CustomAbort(400, "no room with this ID")
	}
	room.ID = roomID

	//if room.RoomNo != "" {
	//	if isValid, msg := utils.ValidateAPI(
	//	//utils.ValidateRoomNo(room.RoomNo),
	//	); !isValid {
	//		r.Ctx.Output.Header("Content-Type", "application/json")
	//		r.CustomAbort(400, strings.Join(msg, ""))
	//	}
	//}

	err = models.EditRoom(room)
	if err != nil {
		r.CustomAbort(400, err.Error())
	}
	r.Data["json"] = "Edit successfully"
	err = r.ServeJSON()
	if err != nil {
		r.Abort(utils.HotelState[500])
	}
}

// GetRoomByID @Title Get room by id
// @Param id path string true "Id of Room"
// @Description Get room information by id
// @Success 200
// @router /room/:id [get]
func (r *RoomController) GetRoomByID() {
	id := r.Ctx.Input.Param(":id")
	roomID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		r.CustomAbort(400, utils.HotelState[400])
	}
	room, err := models.GetRoomByID(roomID)
	if err != nil {
		r.CustomAbort(400, err.Error())
	}
	r.Data["json"] = room
	err = r.ServeJSON()
	if err != nil {
		r.Abort(utils.HotelState[500])
	}
}

// DeleteMultipleRooms @Title DeleteMultipleRooms
// @Param rooms body models.RoomList true "List of rooms to delete"
// @Description Delete multiple rooms
// @Success 200
// @router /room/ [delete]
func (r *RoomController) DeleteMultipleRooms() {

	body := r.Ctx.Input.RequestBody
	var roomIDs []primitive.ObjectID
	if err := json.Unmarshal(body, &roomIDs); err != nil {
		r.CustomAbort(400, err.Error())
	}

	count, err := models.DeleteRooms(roomIDs)
	if err != nil {
		r.CustomAbort(400, err.Error())
	}
	if count != len(roomIDs) {
		r.Data["json"] = "Some id in this list might be wrong or not exist"
	} else {
		r.Data["json"] = "Delete all rooms successfully"
	}

	if err := r.ServeJSON(); err != nil {
		r.Abort(utils.HotelState[500])
	}
}

// GetCurrentAvailableRooms @Title GetCurrentAvailableRooms
// @Description Get current available rooms of hotel
// @Success 200
// @router /room/available [get]
func (r *RoomController) GetCurrentAvailableRooms() {
	hotelID := r.GetString("hotelID")
	objHotelID, err := primitive.ObjectIDFromHex(hotelID)
	if err != nil {
		r.CustomAbort(400, utils.HotelState[400])
	}
	rooms, err := models.GetCurrentAvailableRooms(objHotelID)
	if err != nil {
		r.CustomAbort(400, err.Error())
	}

	if rooms == nil {
		r.Data["json"] = make([]string, 0)
	} else {
		r.Data["json"] = rooms
	}
	err = r.ServeJSON()
	if err != nil {
		r.Abort(utils.HotelState[500])
	}
}
