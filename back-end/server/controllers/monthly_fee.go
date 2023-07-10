package controllers

import (
	"encoding/json"
	"github.com/beego/beego/v2/server/web"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"trebooking/models"
	"trebooking/utils"
)

type WeekendController struct {
	web.Controller
}

// GetMonthlyFeeByID @Title GetMonthlyFeeByID
// @Success 200
// @router /monthly-fee [get]
func (w *WeekendController) GetMonthlyFeeByID() {
	//Id of villa, hotel or townhouse
	id := w.GetString("id")

	//Check if object is Villa, hotel or townhouse
	feeType, err := w.GetInt("type")
	if err != nil {
		w.CustomAbort(400, "Type is invalid")
	}

	objID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		w.CustomAbort(400, "Id is invalid")
	}

	fees, err := models.GetMonthlyFee(objID, feeType)
	if err != nil {
		w.CustomAbort(400, err.Error())
	}

	w.Data["json"] = fees
	if err := w.ServeJSON(); err != nil {
		w.Abort(utils.HotelState[500])
	}
}

// GetMonthlyFeeByFeeID @Title GetMonthlyFeeByFeeID
// @Success 200
// @router /monthly-fee/fee [get]
func (w *WeekendController) GetMonthlyFeeByFeeID() {
	feeID := w.GetString("feeID")

	objFeeID, err := primitive.ObjectIDFromHex(feeID)
	if err != nil {
		w.CustomAbort(400, "Id is invalid")
	}

	fees, err := models.GetMonthlyFeeByFeeID(objFeeID)
	if err != nil {
		w.CustomAbort(400, err.Error())
	}

	w.Data["json"] = fees
	if err := w.ServeJSON(); err != nil {
		w.Abort(utils.HotelState[500])
	}
}

// GetMonthlyFeeByMonth @Title GetMonthlyFeeByMonth
// @Success 200
// @router /monthly-fee/month [get]
func (w *WeekendController) GetMonthlyFeeByMonth() {
	//Id of villa, hotel or townhouse
	id := w.GetString("id")

	objID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		w.CustomAbort(400, "Id is invalid")
	}

	//Check if object is Villa, hotel or townhouse
	feeType, err := w.GetInt("type")

	month, err := w.GetInt("month")
	if err != nil {
		month = 1
	}

	fees, err := models.GetMonthlyFeeByMonth(month, objID, feeType)
	if err != nil {
		w.CustomAbort(400, err.Error())
	}

	w.Data["json"] = fees
	if err := w.ServeJSON(); err != nil {
		w.Abort(utils.HotelState[500])
	}
}

// UpdateMonthlyFee @Title UpdateMonthlyFee
// @Success 200
// @router /monthly-fee [put]
func (w *WeekendController) UpdateMonthlyFee() {

	var fee models.MonthlyFee
	body := w.Ctx.Input.RequestBody

	err := json.Unmarshal(body, &fee)

	if err != nil {
		w.CustomAbort(400, utils.HotelState[400])
		return
	}

	var id primitive.ObjectID

	if !fee.HotelID.IsZero() {
		id = fee.HotelID
	} else if !fee.VillaID.IsZero() {
		id = fee.VillaID
	} else {
		id = fee.TownHouseID
	}
	err = models.UpdateMonthlyFee(fee, id)

	if err != nil {
		w.CustomAbort(400, err.Error())
	}

	w.Data["json"] = "update successfully"
	if err = w.ServeJSON(); err != nil {
		w.Abort(utils.HotelState[500])
	}
}

// AddMonthlyFee @Title AddMonthlyFee
// @Success 200
// @router /monthly-fee [post]
func (w *WeekendController) AddMonthlyFee() {

	var fee models.MonthlyFee
	body := w.Ctx.Input.RequestBody

	err := json.Unmarshal(body, &fee)

	if err != nil {
		w.CustomAbort(400, utils.HotelState[400])
		return
	}

	if err = models.AddMonthlyFee(fee, fee.HotelID); err != nil {
		w.CustomAbort(400, err.Error())
	}

	w.Data["json"] = "Add weekend fee successfully"
	if err = w.ServeJSON(); err != nil {
		w.Abort(utils.HotelState[500])
	}
}
