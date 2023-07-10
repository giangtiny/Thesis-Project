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

type VillaOrderController struct {
	web.Controller
}

// CreateVillaOrder @Title Create order villa
// @Param villaOrder body models.VillaTownhouseOrder true
// @router /order/villa [post]
func (vo *VillaOrderController) CreateVillaOrder() {
	body := vo.Ctx.Input.RequestBody
	var paymentResponsePayload models.PaymentResponsePayload
	if err := json.Unmarshal(body, &paymentResponsePayload); err != nil {
		vo.CustomAbort(400, err.Error())
	}
	paymentType := vo.GetString("paymentType")
	if paymentType != "" {
		if paymentResponsePayload.ResponseCode != "00" {
			vo.CustomAbort(400, "Your payment is not valid")
		}
	}

	var villaOrder models.VillaTownhouseOrder
	err := json.Unmarshal(body, &villaOrder)
	if err != nil {
		vo.Abort(err.Error())
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateCheckInCheckOutTime(villaOrder.CheckIn, villaOrder.CheckOut),
		utils.ValidateEmail(villaOrder.Gmail),
		utils.ValidatePhone(villaOrder.PhoneNumber),
		utils.ValidateStringEmpty(villaOrder.UserName, "UserName"),
	)
	if !isValid {
		vo.Ctx.Output.Header("Content-Type", "application/json")
		vo.CustomAbort(400, strings.Join(msg, ""))
	}
	result, err := models.CreateVillaOrder(villaOrder, paymentResponsePayload)
	if err != nil {
		vo.Abort(err.Error())
	}
	vo.Data["json"] = result
	if err := vo.ServeJSON(); err != nil {
		vo.Abort(err.Error())
	}
}

// CalculatePriceVillaOrder @Title CalculatePriceVillaOrder
// @Param villaOrder body models.VillaTownhouseOrder true
// @router /calculatePriceOrder/villa [post]
func (vo *VillaOrderController) CalculatePriceVillaOrder() {
	body := vo.Ctx.Input.RequestBody
	var villaOrder models.VillaTownhouseOrder
	err := json.Unmarshal(body, &villaOrder)
	if err != nil {
		vo.Abort(err.Error())
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateCheckInCheckOutTime(villaOrder.CheckIn, villaOrder.CheckOut),
		utils.ValidateEmail(villaOrder.Gmail),
		utils.ValidatePhone(villaOrder.PhoneNumber),
		utils.ValidateStringEmpty(villaOrder.UserName, "UserName"),
	)
	if !isValid {
		vo.Ctx.Output.Header("Content-Type", "application/json")
		vo.CustomAbort(400, strings.Join(msg, ""))
	}
	result, err := models.CalculatePriceVillaOrder(villaOrder)
	if err != nil {
		vo.Abort(err.Error())
	}
	vo.Data["json"] = result
	if err := vo.ServeJSON(); err != nil {
		vo.Abort(err.Error())
	}
}

// GetAllVillaOrder @Title Get all order villa
// @router /order/villa/all [get]
func (vo *VillaOrderController) GetAllVillaOrder() {
	token := vo.Ctx.Request.Header.Get("Authorization")
	check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff})
	if err != nil {
		vo.Abort("Error")
	}
	if !check {
		vo.CustomAbort(401, "Permission denied")
	}
	result, err := models.GetAllVillaOrder(utils.VILLA)
	if err != nil {
		vo.Abort(err.Error())
	}
	if len(result) > 0 {
		vo.Data["json"] = result
	} else {
		vo.Data["json"] = []models.VillaTownhouseOrder{}
	}
	if err := vo.ServeJSON(); err != nil {
		vo.Abort(err.Error())
	}
}

// GetAllVillaOrderOfVilla @Title Get all order of villa
// @Param villaId path string true "villa id"
// @router /order/villa/:villaId [get]
func (vo *VillaOrderController) GetAllVillaOrderOfVilla() {
	token := vo.Ctx.Request.Header.Get("Authorization")
	check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff})
	if err != nil {
		vo.Abort("Error")
	}
	if !check {
		vo.CustomAbort(401, "Permission denied")
	}
	id := vo.GetString(":villaId")
	if id == "" {
		vo.Abort("VillaId is empty")
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(id),
	)
	if !isValid {
		vo.Ctx.Output.Header("Content-Type", "application/json")
		vo.CustomAbort(400, strings.Join(msg, ""))
	}
	result, err := models.GetAllVillaOrderOfVilla(id)
	if err != nil {
		vo.Abort(err.Error())
	}
	vo.Data["json"] = result
	if err := vo.ServeJSON(); err != nil {
		vo.Abort(err.Error())
	}
}

// UpdateVillaOrder @Title Update order villa
// @Description Update villa order by order id
// @Success 200
// @router /order/villa [put]
func (vo *VillaOrderController) UpdateVillaOrder() {
	//token := ro.Ctx.Request.Header.Get("Authorization")
	//if check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.StaffHotel}); err != nil {
	//	ro.Abort("Error")
	//} else if !check {
	//	ro.CustomAbort(401, "Permission denied")
	//}

	orderID := vo.GetString("orderID")
	//orderType, err := vo.GetInt("orderType")
	order := vo.Ctx.Input.RequestBody
	//if err != nil {
	//	vo.CustomAbort(400, err.Error())
	//}
	objOrderID, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		vo.CustomAbort(400, err.Error())
	}
	var VillaOrder models.VillaTownhouseOrder
	if err := json.Unmarshal(order, &VillaOrder); err != nil {
		vo.CustomAbort(400, err.Error())
	}

	if err := models.UpdateVillaOrder(objOrderID, VillaOrder); err != nil {
		vo.CustomAbort(404, err.Error())
	}

	vo.Data["json"] = "Update villa order successfully"
	err = vo.ServeJSON()
	if err != nil {
		vo.Abort(utils.HotelState[500])
	}
}

// DeleteVillaOrder @Title DeleteVillaOrder
// @Description Delete villa order by order id
// @Success 200
// @router /order/villa [delete]
func (vo *VillaOrderController) DeleteVillaOrder() {
	//token := vo.Ctx.Request.Header.Get("Authorization")
	//if check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff}); err != nil {
	//	vo.Abort("Error")
	//} else if !check {
	//	vo.CustomAbort(401, "Permission denied")
	//}

	orderID := vo.GetString("orderID")
	isValid, valErr := utils.ValidateAPI(
		utils.ValidateObjectID(orderID),
	)
	objID, _ := primitive.ObjectIDFromHex(orderID)
	if !isValid {
		err, _ := json.Marshal(valErr)
		vo.CustomAbort(400, string(err))
	}
	err := models.DeleteVillaOrder(objID)
	if err != nil {
		vo.CustomAbort(404, err.Error())
	}
	vo.Data["json"] = "Delete villa order successfully"
	err = vo.ServeJSON()
	if err != nil {
		vo.Abort(utils.HotelState[500])
	}
}

// GetCurrentUserByVillaID @Title GetCurrentUserByVillaID
// @Description Get user by villa id
// @Success 200
// @router /order/villa/:id [get]
func (vo *VillaOrderController) GetCurrentUserByVillaID() {
	// token := vo.Ctx.Request.Header.Get("Authorization")
	// check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff})
	// if err != nil {
	// 	vo.Abort(err.Error())
	// }
	// if !check {
	// 	vo.CustomAbort(401, "Permission denied")
	// }
	villaID := vo.GetString(":id")
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(villaID),
	)
	if !isValid {
		vo.Ctx.Output.Header("Content-Type", "application/json")
		vo.CustomAbort(400, strings.Join(msg, ""))
	}
	result, err := models.GetCurrentUserByVillaID(villaID)
	if err != nil {
		vo.CustomAbort(400, err.Error())
	}
	vo.Data["json"] = result
	err = vo.ServeJSON()
	if err != nil {
		vo.Abort(utils.HotelState[500])
	}
}

// GetVillaOrderByID @Title GetVillaOrderByID
// @Description Get room order by villa order id
// @Success 200
// @router /order/villa/order [get]
func (vo *VillaOrderController) GetVillaOrderByID() {
	//token := vo.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.StaffHotel})
	//if err != nil {
	//	vo.Abort("Error")
	//}
	//if !check {
	//	vo.CustomAbort(401, "Permission denied")
	//}

	orderID := vo.GetString("orderID")
	objOrderID, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		vo.CustomAbort(400, err.Error())
	}

	isValid, valErr := utils.ValidateAPI(
		utils.ValidateObjectID(orderID),
	)
	if !isValid {
		err, _ := json.Marshal(valErr)
		vo.CustomAbort(400, string(err))
	}
	order, err := models.GetVillaOrderByOrderID(objOrderID)
	if err != nil {
		vo.CustomAbort(404, err.Error())
	}

	vo.Data["json"] = order
	err = vo.ServeJSON()
	if err != nil {
		vo.Abort(utils.HotelState[500])
	}
}

// GetVillaInvoiceDetail @Title GetVillaInvoiceDetail
// @Description Get detail of villa invoice
// @Success 200
// @router /order/villa/invoice [get]
func (vo *VillaOrderController) GetVillaInvoiceDetail() {
	orderType, err := vo.GetUint8("orderType")

	if err != nil {
		vo.CustomAbort(400, err.Error())
	}
	orderID := vo.GetString("orderID")
	objOrderID, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		vo.CustomAbort(400, err.Error())
	}
	invoiceDetail, err := models.GetVillaTownhouseInvoiceByOrderID(objOrderID, orderType)
	if err != nil {
		vo.CustomAbort(400, err.Error())
	}
	vo.Data["json"] = invoiceDetail
	err = vo.ServeJSON()
	if err != nil {
		vo.Abort(utils.HotelState[500])
	}
}

// GetStaticsVillaByDate @Title Get Statics By Date
// @Description Get Statics of Hotel By Date
// @Param date path string true "date"
// @Param month path string true "month"
// @Success 200
// @router /order/villa/statics [get]
func (vo *VillaOrderController) GetStaticsVillaByDate() {
	dayRq := vo.GetString("day")
	monthRq := vo.GetString("month")
	yearRq := vo.GetString("year")
	villaID := vo.GetString("villaID")

	dayRs, err := strconv.ParseUint(dayRq, 10, 64) // Convert string to uint64
	if err != nil {
		vo.CustomAbort(400, "wrong day format")
	}
	monthRs, err := strconv.ParseUint(monthRq, 10, 64) // Convert string to uint64
	if err != nil {
		vo.CustomAbort(400, "wrong month format")
	}
	yearRs, err := strconv.ParseUint(yearRq, 10, 64) // Convert string to uint64
	if err != nil {
		vo.CustomAbort(400, "wrong year format")
	}
	day := uint(dayRs)
	month := uint(monthRs)
	year := uint(yearRs)
	objVillaID, err := primitive.ObjectIDFromHex(villaID)
	if err != nil {
		vo.CustomAbort(400, "no order with this id")
	}

	// Get order by day and month
	statistics, err := models.GetStatisticsVillaByDayAndMonth(day, month, year, objVillaID)
	if err != nil {
		vo.CustomAbort(404, err.Error())
	}
	vo.Data["json"] = statistics
	err = vo.ServeJSON()
	if err != nil {
		vo.Abort(utils.HotelState[500])
	}
}
