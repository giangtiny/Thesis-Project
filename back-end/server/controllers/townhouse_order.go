package controllers

import (
	"encoding/json"
	"strconv"
	"strings"
	"trebooking/models"
	"trebooking/utils"

	"github.com/beego/beego/v2/server/web"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TownhouseOrderController struct {
	web.Controller
}

// CreateTownhouseOrder @Title Create order townhouse
// @Param townhouseOrder body models.VillaTownhouseOrder true
// @router /order/townhouse [post]
func (to *TownhouseOrderController) CreateTownhouseOrder() {
	body := to.Ctx.Input.RequestBody
	var paymentResponsePayload models.PaymentResponsePayload
	if err := json.Unmarshal(body, &paymentResponsePayload); err != nil {
		to.CustomAbort(400, err.Error())
	}
	paymentType := to.GetString("paymentType")
	if paymentType != "" {
		if paymentResponsePayload.ResponseCode != "00" {
			to.CustomAbort(400, "Your payment is not valid")
		}
	}

	var townhouseOrder models.VillaTownhouseOrder
	err := json.Unmarshal(to.Ctx.Input.RequestBody, &townhouseOrder)
	if err != nil {
		to.Abort(err.Error())
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateCheckInCheckOutTime(townhouseOrder.CheckIn, townhouseOrder.CheckOut),
		utils.ValidateEmail(townhouseOrder.Gmail),
		utils.ValidatePhone(townhouseOrder.PhoneNumber),
		utils.ValidateStringEmpty(townhouseOrder.UserName, "UserName"),
	)
	if !isValid {
		to.Ctx.Output.Header("Content-Type", "application/json")
		to.CustomAbort(400, strings.Join(msg, ""))
	}
	townhouseOrder.ID = primitive.NilObjectID
	result, err := models.CreateTownhouseOrder(townhouseOrder, paymentResponsePayload)
	if err != nil {
		to.Abort(err.Error())
	}
	to.Data["json"] = result
	if err := to.ServeJSON(); err != nil {
		to.Abort(err.Error())
	}
}

// CalculatePriceTownhouseOrder @Title CalculatePriceTownhouseOrder
// @Param townhouseOrder body models.VillaTownhouseOrder true
// @router /calculatePriceOrder/townhouse [post]
func (to *TownhouseOrderController) CalculatePriceTownhouseOrder() {
	body := to.Ctx.Input.RequestBody

	var townhouseOrder models.VillaTownhouseOrder
	err := json.Unmarshal(body, &townhouseOrder)
	if err != nil {
		to.Abort(err.Error())
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateCheckInCheckOutTime(townhouseOrder.CheckIn, townhouseOrder.CheckOut),
		utils.ValidateEmail(townhouseOrder.Gmail),
		utils.ValidatePhone(townhouseOrder.PhoneNumber),
		utils.ValidateStringEmpty(townhouseOrder.UserName, "UserName"),
	)
	if !isValid {
		to.Ctx.Output.Header("Content-Type", "application/json")
		to.CustomAbort(400, strings.Join(msg, ""))
	}
	townhouseOrder.ID = primitive.NilObjectID
	result, err := models.CalculatePriceTownhouseOrder(townhouseOrder)
	if err != nil {
		to.Abort(err.Error())
	}
	to.Data["json"] = result
	if err := to.ServeJSON(); err != nil {
		to.Abort(err.Error())
	}
}

// GetAllTownhouseOrder @Title Get all order of townhouse
// @router /order/townhouse/all [get]
func (to *TownhouseOrderController) GetAllTownhouseOrder() {
	token := to.Ctx.Request.Header.Get("Authorization")
	check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff})
	if err != nil {
		to.Abort("Error")
	}
	if !check {
		to.CustomAbort(401, "Permission denied")
	}
	result, err := models.GetAllTownhouseOrder(utils.TOWN_HOUSE)
	if err != nil {
		to.Abort(err.Error())
	}
	if len(result) > 0 {
		to.Data["json"] = result
	} else {
		to.Data["json"] = []models.VillaTownhouseOrder{}
	}
	if err := to.ServeJSON(); err != nil {
		to.Abort(err.Error())
	}
}

// GetAllTownhouseOrderOfTownhouse @Title Get all order of townhouse
// @Param townhouseId path string true "townhouse id"
// @router /order/townhouse/:townhouseId [get]
func (to *TownhouseOrderController) GetAllTownhouseOrderOfTownhouse() {
	token := to.Ctx.Request.Header.Get("Authorization")
	check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff})
	if err != nil {
		to.Abort("Error")
	}
	if !check {
		to.CustomAbort(401, "Permission denied")
	}
	id := to.GetString(":townhouseId")
	if id == "" {
		to.Abort("TownhouseId is empty")
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(id),
	)
	if !isValid {
		to.Ctx.Output.Header("Content-Type", "application/json")
		to.CustomAbort(400, strings.Join(msg, ""))
	}
	result, err := models.GetAllTownhouseOrderOfTownhouse(id)
	if err != nil {
		to.Abort(err.Error())
	}
	to.Data["json"] = result
	if err := to.ServeJSON(); err != nil {
		to.Abort(err.Error())
	}
}

// UpdateTownhouseOrder @Title Update order townhouse
// @Description Update townhouse order by order id
// @Success 200
// @router /order/townhouse [put]
func (to *TownhouseOrderController) UpdateTownhouseOrder() {
	//token := ro.Ctx.Request.Header.Get("Authorization")
	//if check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.StaffHotel}); err != nil {
	//	ro.Abort("Error")
	//} else if !check {
	//	ro.CustomAbort(401, "Permission denied")
	//}

	orderID := to.GetString("orderID")
	//orderType, err := to.GetInt("orderType")
	order := to.Ctx.Input.RequestBody
	//if err != nil {
	//	to.CustomAbort(400, err.Error())
	//}
	objOrderID, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		to.CustomAbort(400, err.Error())
	}
	var TownhouseOrder models.VillaTownhouseOrder
	if err := json.Unmarshal(order, &TownhouseOrder); err != nil {
		to.CustomAbort(400, err.Error())
	}

	if err := models.UpdateTownhouseOrder(objOrderID, TownhouseOrder); err != nil {
		to.CustomAbort(404, err.Error())
	}

	to.Data["json"] = "Update townhouse order successfully"
	err = to.ServeJSON()
	if err != nil {
		to.Abort(utils.HotelState[500])
	}
}

// DeleteTownhouseOrder @Title DeleteTownhouseOrder
// @Description Delete townhouse order by order id
// @Success 200
// @router /order/townhouse [delete]
func (to *TownhouseOrderController) DeleteTownhouseOrder() {
	//token := to.Ctx.Request.Header.Get("Authorization")
	//if check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff}); err != nil {
	//	to.Abort("Error")
	//} else if !check {
	//	to.CustomAbort(401, "Permission denied")
	//}

	orderID := to.GetString("orderID")
	isValid, valErr := utils.ValidateAPI(
		utils.ValidateObjectID(orderID),
	)
	objID, _ := primitive.ObjectIDFromHex(orderID)
	if !isValid {
		err, _ := json.Marshal(valErr)
		to.CustomAbort(400, string(err))
	}
	err := models.DeleteTownhouseOrder(objID)
	if err != nil {
		to.CustomAbort(404, err.Error())
	}

	to.Data["json"] = "Delete townhouse order successfully"
	err = to.ServeJSON()
	if err != nil {
		to.Abort(utils.HotelState[500])
	}
}

// GetCurrentUserByTownhouseID @Title GetCurrentUserByTownhouseID
// @Description Get user by townhouse id
// @Success 200
// @router /order/townhouse/:id [get]
func (to *TownhouseOrderController) GetCurrentUserByTownhouseID() {
	// token := to.Ctx.Request.Header.Get("Authorization")
	// check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff})
	// if err != nil {
	// 	to.Abort(err.Error())
	// }
	// if !check {
	// 	to.CustomAbort(401, "Permission denied")
	// }
	villaID := to.GetString(":id")
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(villaID),
	)
	if !isValid {
		to.Ctx.Output.Header("Content-Type", "application/json")
		to.CustomAbort(400, strings.Join(msg, ""))
	}
	result, err := models.GetCurrentUserByTownhouseID(villaID)
	if err != nil {
		to.CustomAbort(400, err.Error())
	}
	to.Data["json"] = result
	err = to.ServeJSON()
	if err != nil {
		to.Abort(utils.HotelState[500])
	}
}

// GetTownhouseInvoiceDetail @Title GetTownhouseInvoiceDetail
// @Description Get detail of townhouse invoice
// @Success 200
// @router /order/townhouse/invoice [get]
func (to *TownhouseOrderController) GetTownhouseInvoiceDetail() {
	orderType, err := to.GetUint8("orderType")

	if err != nil {
		to.CustomAbort(400, err.Error())
	}
	orderID := to.GetString("orderID")
	objOrderID, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		to.CustomAbort(400, err.Error())
	}
	invoiceDetail, err := models.GetVillaTownhouseInvoiceByOrderID(objOrderID, orderType)
	if err != nil {
		to.CustomAbort(400, err.Error())
	}
	to.Data["json"] = invoiceDetail
	err = to.ServeJSON()
	if err != nil {
		to.Abort(utils.HotelState[500])
	}
}

// GetTownhouseOrderByID @Title GetTownhouseOrderByID
// @Description Get room order by townhouse order id
// @Success 200
// @router /order/townhouse/order [get]
func (to *TownhouseOrderController) GetTownhouseOrderByID() {
	//token := to.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.StaffHotel})
	//if err != nil {
	//	to.Abort("Error")
	//}
	//if !check {
	//	to.CustomAbort(401, "Permission denied")
	//}

	orderID := to.GetString("orderID")
	objOrderID, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		to.CustomAbort(400, err.Error())
	}

	isValid, valErr := utils.ValidateAPI(
		utils.ValidateObjectID(orderID),
	)
	if !isValid {
		err, _ := json.Marshal(valErr)
		to.CustomAbort(400, string(err))
	}
	order, err := models.GetTownhouseOrderByOrderID(objOrderID)
	if err != nil {
		to.CustomAbort(404, err.Error())
	}

	to.Data["json"] = order
	err = to.ServeJSON()
	if err != nil {
		to.Abort(utils.HotelState[500])
	}
}

// GetStaticsTownhouseByDate @Title Get Statics By Date
// @Description Get Statics of Hotel By Date
// @Param date path string true "date"
// @Param month path string true "month"
// @Success 200
// @router /order/townhouse/statics [get]
func (to *TownhouseOrderController) GetStaticsTownhouseByDate() {
	dayRq := to.GetString("day")
	monthRq := to.GetString("month")
	yearRq := to.GetString("year")
	townhouseID := to.GetString("townhouseID")

	dayRs, err := strconv.ParseUint(dayRq, 10, 64) // Convert string to uint64
	if err != nil {
		to.CustomAbort(400, "wrong day format")
	}
	monthRs, err := strconv.ParseUint(monthRq, 10, 64) // Convert string to uint64
	if err != nil {
		to.CustomAbort(400, "wrong month format")
	}
	yearRs, err := strconv.ParseUint(yearRq, 10, 64) // Convert string to uint64
	if err != nil {
		to.CustomAbort(400, "wrong year format")
	}
	day := uint(dayRs)
	month := uint(monthRs)
	year := uint(yearRs)
	objTownhouseID, err := primitive.ObjectIDFromHex(townhouseID)
	if err != nil {
		to.CustomAbort(400, "no order with this id")
	}
	// Get order by day and month
	statistics, err := models.GetStatisticsTownhouseByDayAndMonth(day, month, year, objTownhouseID)
	if err != nil {
		to.CustomAbort(404, err.Error())
	}
	to.Data["json"] = statistics
	err = to.ServeJSON()
	if err != nil {
		to.Abort(utils.HotelState[500])
	}
}
