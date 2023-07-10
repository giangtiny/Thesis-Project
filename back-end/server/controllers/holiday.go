package controllers

import (
	"encoding/json"
	"trebooking/models"
	"trebooking/utils"

	"github.com/beego/beego/v2/server/web"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type HolidayController struct {
	web.Controller
}

// GetHolidayFeeByHotelID @Title GetHolidayFeeByHotelID
// @Success 200
// @router /holiday/hotel [get]
func (h *HolidayController) GetHolidayFeeByHotelID() {
	hotelID := h.GetString("hotelID")

	objHotelID, err := primitive.ObjectIDFromHex(hotelID)
	if err != nil {
		h.CustomAbort(400, "hotel id is invalid")
	}
	h.GetHolidayFeeByItemID(objHotelID, 0)
}

// GetHolidayFeeByVillaID @Title GetHolidayFeeByVillaID
// @Success 200
// @router /holiday/villa [get]
func (h *HolidayController) GetHolidayFeeByVillaID() {
	villaID := h.GetString("villaID")

	objVillaID, err := primitive.ObjectIDFromHex(villaID)
	if err != nil {
		h.CustomAbort(400, "villa id is invalid")
	}
	h.GetHolidayFeeByItemID(objVillaID, 1)
}

// GetHolidayFeeByTownhouseID @Title GetHolidayFeeByTownhouseID
// @Success 200
// @router /holiday/townhouse [get]
func (h *HolidayController) GetHolidayFeeByTownhouseID() {
	townhouseID := h.GetString("townhouseID")

	objTownhouseID, err := primitive.ObjectIDFromHex(townhouseID)
	if err != nil {
		h.CustomAbort(400, "townhouse id is invalid")
	}
	h.GetHolidayFeeByItemID(objTownhouseID, 2)
}

func (h *HolidayController) GetHolidayFeeByItemID(id primitive.ObjectID, holidayType int) {
	holidays, err := models.GetHolidayByItemID(id, holidayType)
	if err != nil {
		h.CustomAbort(400, err.Error())
	}
	if len(holidays) == 0 {
		holidays = []models.EventFeeAndPromotion{}
	}

	h.Data["json"] = holidays
	err = h.ServeJSON()
	if err != nil {
		h.Abort(utils.HotelState[500])
	}
}

// GetHolidayHotelFeeByMonth @Title GetHolidayHotelFeeByMonth
// @Success 200
// @router /holiday/hotel/month [get]
func (h *HolidayController) GetHolidayHotelFeeByMonth() {
	hotelID := h.GetString("hotelID")
	month, err := h.GetInt("month")
	if err != nil {
		month = 1
	}
	objHotelID, err := primitive.ObjectIDFromHex(hotelID)
	if err != nil {
		h.CustomAbort(400, "hotel id is invalid")
	}
	h.GetHolidayFeeByMonth(objHotelID, 0, month)
}

// GetHolidayVillaFeeByMonth @Title GetHolidayVillaFeeByMonth
// @Success 200
// @router /holiday/villa/month [get]
func (h *HolidayController) GetHolidayVillaFeeByMonth() {
	villaID := h.GetString("villaID")
	month, err := h.GetInt("month")
	if err != nil {
		month = 1
	}
	objVillaID, err := primitive.ObjectIDFromHex(villaID)
	if err != nil {
		h.CustomAbort(400, "villa id is invalid")
	}
	h.GetHolidayFeeByMonth(objVillaID, 1, month)
}

// GetHolidayTownhouseFeeByMonth @Title GetHolidayHotelFeeByMonth
// @Success 200
// @router /holiday/townhouse/month [get]
func (h *HolidayController) GetHolidayTownhouseFeeByMonth() {
	townhouseID := h.GetString("townhouseID")
	month, err := h.GetInt("month")
	if err != nil {
		month = 1
	}
	objTownhouseID, err := primitive.ObjectIDFromHex(townhouseID)
	if err != nil {
		h.CustomAbort(400, "townhouse id is invalid")
	}
	h.GetHolidayFeeByMonth(objTownhouseID, 2, month)
}

func (h *HolidayController) GetHolidayFeeByMonth(id primitive.ObjectID, holidayType int, month int) {
	holidays, err := models.GetHolidayByMonth(id, holidayType, month)
	if err != nil {
		h.CustomAbort(400, err.Error())
	}

	if holidays == nil {
		h.Data["json"] = make([]string, 0)
	} else {
		h.Data["json"] = holidays
	}
	err = h.ServeJSON()
	if err != nil {
		h.Abort(utils.HotelState[500])
	}
}

// AddHolidayHotelFee @Title AddHolidayHotelFee
// @Success 200
// @router /holiday/hotel [post]
func (h *HolidayController) AddHolidayHotelFee() {
	h.AddHolidayFee(0)
}

// AddHolidayVillaFee @Title AddHolidayVillaFee
// @Success 200
// @router /holiday/villa [post]
func (h *HolidayController) AddHolidayVillaFee() {
	h.AddHolidayFee(1)
}

// AddHolidayTownhouseFee @Title AddHolidayTownhouseFee
// @Success 200
// @router /holiday/townhouse [post]
func (h *HolidayController) AddHolidayTownhouseFee() {
	h.AddHolidayFee(2)
}

func (h *HolidayController) AddHolidayFee(holidayType int) {
	var holidayFee models.EventFeeAndPromotion
	body := h.Ctx.Input.RequestBody

	err := json.Unmarshal(body, &holidayFee)

	if err != nil {
		h.CustomAbort(400, utils.HotelState[400])
		return
	}

	err = models.AddHolidayFee(holidayFee, holidayType)
	if err != nil {
		h.CustomAbort(400, err.Error())
	}

	h.Data["json"] = "Add holiday fee successfully"
	err = h.ServeJSON()
	if err != nil {
		h.Abort(utils.HotelState[500])
	}
}

// DeleteHolidayFees @Title DeleteHolidayFees
// @Success 200
// @router /holiday [delete]
func (h *HolidayController) DeleteHolidayFees() {
	var holidayFees []primitive.ObjectID
	body := h.Ctx.Input.RequestBody

	err := json.Unmarshal(body, &holidayFees)

	if err != nil {
		h.CustomAbort(400, utils.HotelState[400])
		return
	}

	err = models.DeleteHolidayFees(holidayFees)
	if err != nil {
		h.CustomAbort(400, err.Error())
	}

	h.Data["json"] = "Delete all holiday fees successfully"
	err = h.ServeJSON()
	if err != nil {
		h.Abort(utils.HotelState[500])
	}
}

// UpdateHolidayFee @Title UpdateHolidayFee
// @Success 200
// @router /holiday/:holidayID [put]
func (h *HolidayController) UpdateHolidayFee() {
	holidayID := h.GetString(":holidayID")
	objHolidayID, err := primitive.ObjectIDFromHex(holidayID)
	if err != nil {
		h.CustomAbort(400, err.Error())
	}

	var fee models.EventFeeAndPromotion
	body := h.Ctx.Input.RequestBody

	if err = json.Unmarshal(body, &fee); err != nil {
		h.CustomAbort(400, utils.HotelState[400])
		return
	}

	if err = models.UpdateHolidayFee(objHolidayID, fee); err != nil {
		h.CustomAbort(400, err.Error())
	}

	h.Data["json"] = "Update holiday fee successfully"
	if err = h.ServeJSON(); err != nil {
		h.Abort(utils.HotelState[500])
	}
}
