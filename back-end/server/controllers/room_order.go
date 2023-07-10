package controllers

import (
	"encoding/json"
	"strconv"
	"strings"
	"time"
	"trebooking/jwt"
	"trebooking/models"
	"trebooking/utils"

	"go.mongodb.org/mongo-driver/bson/primitive"

	beego "github.com/beego/beego/v2/server/web"
)

type RoomOrderController struct {
	beego.Controller
}

// CreateRoomOrder @Title CreateRoomOrder
// @Description Create order
// @Success 200
// @router /order/room [post]
func (ro *RoomOrderController) CreateRoomOrder() {
	body := ro.Ctx.Input.RequestBody
	var paymentResponsePayload models.PaymentResponsePayload
	if err := json.Unmarshal(body, &paymentResponsePayload); err != nil {
		ro.CustomAbort(400, err.Error())
	}
	orderType, err := ro.GetInt("orderType")
	if err != nil {
		ro.CustomAbort(400, "Order type is invalid, please enter orderType")
	}

	// orderType = 0 -> HourOrder
	// orderType = 1 -> DayOrder
	if orderType == models.HourOrder {
		var hourOrder models.HourRoomOrder
		if err := json.Unmarshal(body, &hourOrder); err != nil {
			ro.CustomAbort(400, err.Error())
		}

		if hourOrder.CheckOut == 0 {
			additionalTime := primitive.NewDateTimeFromTime(hourOrder.CheckIn.Time().Add(time.Hour * 22))
			hourOrder.CheckOut = additionalTime
			hourOrder.CurrentTime = additionalTime
		}

		isValid, eStr := models.ValidateAllFieldOfNewOrder(hourOrder.RoomOrder)

		if !isValid {
			ro.CustomAbort(400, eStr)
		}
		if _, err := models.CreateHourRoomOrder(hourOrder); err != nil {
			ro.CustomAbort(400, err.Error())
		}
	} else {
		var dayOrder models.DayRoomOrder
		if err := json.Unmarshal(body, &dayOrder); err != nil {
			ro.CustomAbort(400, err.Error())
		}

		if dayOrder.CheckOut == 0 {
			ro.CustomAbort(400, "Day order must have checkout time")
		}

		isValid, eStr := models.ValidateAllFieldOfNewOrder(dayOrder.RoomOrder)

		if !isValid {
			ro.CustomAbort(400, eStr)
		}
		_, err := models.CreateDayRoomOrder(dayOrder, paymentResponsePayload)
		if err != nil {
			ro.CustomAbort(400, err.Error())
		}
	}

	ro.Data["json"] = "Create room order successfully"
	err = ro.ServeJSON()
	if err != nil {
		ro.Abort(utils.HotelState[500])
	}
}

// CalculatePriceRoomOrder @Title CalculatePriceRoomOrder
// @Description CalculatePriceRoomOrder
// @Success 200
// @router /calculatePriceOrder/room [post]
func (ro *RoomOrderController) CalculatePriceRoomOrder() {
	body := ro.Ctx.Input.RequestBody
	orderType, err := ro.GetInt("orderType")
	if err != nil {
		ro.CustomAbort(400, "Order type is invalid, please enter orderType")
	}
	// orderType = 0 -> HourOrder
	// orderType = 1 -> DayOrder
	if orderType == models.HourOrder {
		var hourOrder models.HourRoomOrder
		if err := json.Unmarshal(body, &hourOrder); err != nil {
			ro.CustomAbort(400, err.Error())
		}

		if hourOrder.CheckOut == 0 {
			additionalTime := primitive.NewDateTimeFromTime(hourOrder.CheckIn.Time().Add(time.Hour * 22))
			hourOrder.CheckOut = additionalTime
			hourOrder.CurrentTime = additionalTime
		}

		isValid, eStr := models.ValidateAllFieldOfNewOrder(hourOrder.RoomOrder)

		if !isValid {
			ro.CustomAbort(400, eStr)
		}
		if _, err := models.CalculatePriceHourRoomOrder(hourOrder); err != nil {
			ro.CustomAbort(400, err.Error())
		}
		ro.Data["json"] = hourOrder
		err = ro.ServeJSON()
	} else {
		var dayOrder models.DayRoomOrder
		if err := json.Unmarshal(body, &dayOrder); err != nil {
			ro.CustomAbort(400, err.Error())
		}

		if dayOrder.CheckOut == 0 {
			ro.CustomAbort(400, "Day order must have checkout time")
		}

		isValid, eStr := models.ValidateAllFieldOfNewOrder(dayOrder.RoomOrder)

		if !isValid {
			ro.CustomAbort(400, eStr)
		}
		_, err := models.CalculatePriceDayRoomOrder(dayOrder)
		if err != nil {
			ro.CustomAbort(400, err.Error())
		}
		ro.Data["json"] = dayOrder
		err = ro.ServeJSON()
	}
	if err != nil {
		ro.Abort(utils.HotelState[500])
	}
}

// GetOrderByID @Title GetOrderByID
// @Description Get room order by order id
// @Success 200
// @router /order/room/order [get]
func (ro *RoomOrderController) GetOrderByID() {
	//token := ro.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.StaffHotel})
	//if err != nil {
	//	ro.Abort("Error")
	//}
	//if !check {
	//	ro.CustomAbort(401, "Permission denied")
	//}

	orderID := ro.GetString("orderID")
	objOrderID, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		ro.CustomAbort(400, err.Error())
	}

	isValid, valErr := utils.ValidateAPI(
		utils.ValidateObjectID(orderID),
	)
	if !isValid {
		err, _ := json.Marshal(valErr)
		ro.CustomAbort(400, string(err))
	}
	order, err := models.GetOrderByOrderID(objOrderID)
	if err != nil {
		ro.CustomAbort(404, err.Error())
	}

	ro.Data["json"] = order
	err = ro.ServeJSON()
	if err != nil {
		ro.Abort(utils.HotelState[500])
	}
}

// GetOrderByOwner @Title GetOrderByOwner
// @Description Get room order by user id
// @Success 200
// @router /order/room/owner [get]
func (ro *RoomOrderController) GetOrderByOwner() {
	//userID := ro.GetString("ownerID")
	//if isValid, valErr := utils.ValidateAPI(
	//	utils.ValidateObjectID(userID),
	//); !isValid {
	//	ro.Ctx.Output.Header("Content-Type", "application/json")
	//	err, _ := json.Marshal(valErr)
	//	ro.CustomAbort(400, string(err))
	//}

	token := ro.Ctx.Request.Header.Get("Authorization")
	userID, err := jwt.GetIdOfAccount(token)
	if err != nil {
		ro.CustomAbort(400, err.Error())
	}
	orders, err := models.GetOrderByOwner(userID)
	if err != nil {
		ro.CustomAbort(404, err.Error())
	}

	if orders == nil {
		ro.Data["json"] = make([]string, 0)
	} else {
		ro.Data["json"] = orders
	}
	err = ro.ServeJSON()
	if err != nil {
		ro.Abort(utils.HotelState[500])
	}
}

// GetOrderByHotel @Title GetOrderByHotel
// @Description Get room order by user id
// @Success 200
// @router /order/room/hotel [get]
func (ro *RoomOrderController) GetOrderByHotel() {
	hotelID := ro.GetString("hotelID")
	if isValid, valErr := utils.ValidateAPI(
		utils.ValidateObjectID(hotelID),
	); !isValid {
		ro.Ctx.Output.Header("Content-Type", "application/json")
		err, _ := json.Marshal(valErr)
		ro.CustomAbort(400, string(err))
	}

	objHotelID, _ := primitive.ObjectIDFromHex(hotelID)

	orders, err := models.GetOrdersByHotelID(objHotelID)
	if err != nil {
		ro.CustomAbort(404, err.Error())
	}

	if orders == nil {
		ro.Data["json"] = make([]string, 0)
	} else {
		ro.Data["json"] = orders
	}
	err = ro.ServeJSON()
	if err != nil {
		ro.Abort(utils.HotelState[500])
	}
}

// GetOrdersByRoom @Title GetOrdersByRoom
// @Description Get all room-orders by of room id
// @Success 200
// @router /order/room [get]
func (ro *RoomOrderController) GetOrdersByRoom() {

	//token := ro.Ctx.Request.Header.Get("Authorization")
	//check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.StaffHotel})
	//if err != nil {
	//	ro.Abort("Error")
	//}
	//if !check {
	//	ro.CustomAbort(401, "Permission denied")
	//}

	roomID := ro.GetString("roomID")
	isValid, valErr := utils.ValidateAPI(
		utils.ValidateObjectID(roomID),
	)
	if !isValid {
		err, _ := json.Marshal(valErr)
		ro.CustomAbort(400, string(err))
	}
	roomOrders, err := models.GetOrdersByRoom(roomID)
	if err != nil {
		ro.CustomAbort(400, err.Error())
	}

	if roomOrders == nil {
		ro.Data["json"] = make([]string, 0)
	} else {
		ro.Data["json"] = roomOrders
	}
	err = ro.ServeJSON()
	if err != nil {
		ro.Abort(utils.HotelState[500])
	}
}

// DeleteRoomOrder @Title DeleteRoomOrder
// @Description Delete room order by order id
// @Success 200
// @router /order/room [delete]
func (ro *RoomOrderController) DeleteRoomOrder() {

	//token := ro.Ctx.Request.Header.Get("Authorization")
	//if check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.StaffHotel}); err != nil {
	//	ro.Abort("Error")
	//} else if !check {
	//	ro.CustomAbort(401, "Permission denied")
	//}

	orderID := ro.GetString("orderID")
	isValid, valErr := utils.ValidateAPI(
		utils.ValidateObjectID(orderID),
	)
	objID, _ := primitive.ObjectIDFromHex(orderID)
	if !isValid {
		err, _ := json.Marshal(valErr)
		ro.CustomAbort(400, string(err))
	}
	err := models.DeleteRoomOrder(objID)
	if err != nil {
		ro.CustomAbort(404, err.Error())
	}

	ro.Data["json"] = "Delete room order successfully"
	err = ro.ServeJSON()
	if err != nil {
		ro.Abort(utils.HotelState[500])
	}
}

// UpdateRoomOrder @Title UpdateRoomOrder
// @Description Update room order by order id
// @Success 200
// @router /order/room [put]
func (ro *RoomOrderController) UpdateRoomOrder() {

	//token := ro.Ctx.Request.Header.Get("Authorization")
	//if check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.StaffHotel}); err != nil {
	//	ro.Abort("Error")
	//} else if !check {
	//	ro.CustomAbort(401, "Permission denied")
	//}

	orderID := ro.GetString("orderID")
	orderType, err := ro.GetInt("orderType")
	order := ro.Ctx.Input.RequestBody
	if err != nil {
		ro.CustomAbort(400, err.Error())
	}
	objOrderID, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		ro.CustomAbort(400, err.Error())
	}

	if orderType == models.HourOrder {
		var hourOrder models.HourRoomOrder
		if err := json.Unmarshal(order, &hourOrder); err != nil {
			ro.CustomAbort(400, err.Error())
		}

		if err := models.UpdateHourRoomOrder(objOrderID, hourOrder); err != nil {
			ro.CustomAbort(400, err.Error())
		}
	} else {
		var dayOrder models.DayRoomOrder
		if err := json.Unmarshal(order, &dayOrder); err != nil {
			ro.CustomAbort(400, err.Error())
		}

		if err := models.UpdateDayRoomOrder(objOrderID, dayOrder); err != nil {
			ro.CustomAbort(404, err.Error())
		}
	}

	//ro.Data["json"] = "Update room order successfully"

	orderReq, err := models.GetOrderByOrderID(objOrderID)
	if err != nil {
		ro.CustomAbort(404, err.Error())
	}
	ro.Data["json"] = orderReq
	err = ro.ServeJSON()
	if err != nil {
		ro.Abort(utils.HotelState[500])
	}
}

// GetCurrentUserByRoomID @Title GetCurrentUserByRoomID
// @Description Get user by room id
// @Success 200
// @router /order/room/:id [get]
func (ro *RoomOrderController) GetCurrentUserByRoomID() {
	token := ro.Ctx.Request.Header.Get("Authorization")
	check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin, utils.Staff})
	if err != nil {
		ro.Abort(err.Error())
	}
	if !check {
		ro.CustomAbort(401, "Permission denied")
	}
	roomID := ro.GetString(":id")
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(roomID),
	)
	if !isValid {
		ro.Ctx.Output.Header("Content-Type", "application/json")
		ro.CustomAbort(400, strings.Join(msg, ""))
	}
	result, err := models.GetCurrentUserByRoomID(roomID)
	if err != nil {
		ro.CustomAbort(400, err.Error())
	}
	ro.Data["json"] = result
	err = ro.ServeJSON()
	if err != nil {
		ro.Abort(utils.HotelState[500])
	}
}

// GetInvoiceDetail @Title GetInvoiceDetail
// @Description Get detail of invoice
// @Success 200
// @router /order/invoice [get]
func (ro *RoomOrderController) GetInvoiceDetail() {
	orderType, err := ro.GetInt("orderType")

	if err != nil {
		ro.CustomAbort(400, err.Error())
	}
	orderID := ro.GetString("orderID")
	objOrderID, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		ro.CustomAbort(400, err.Error())
	}
	invoiceDetail, err := models.GetInvoiceDetailByDefault(objOrderID, orderType)
	if err != nil {
		ro.CustomAbort(400, err.Error())
	}
	ro.Data["json"] = invoiceDetail
	err = ro.ServeJSON()
	if err != nil {
		ro.Abort(utils.HotelState[500])
	}
}

// GetInvoiceByTimeStamp @Title GetInvoiceByTimeStamp
// @Description Get detail of invoice by time stamp
// @Success 200
// @router /order/invoice/timestamp [get]
func (ro *RoomOrderController) GetInvoiceByTimeStamp() {
	orderID := ro.GetString("orderID")
	timeReq := ro.GetString("timeStamp")
	orderType, err := ro.GetInt("orderType")

	objOrderID, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		ro.CustomAbort(400, "no order with this id")
	}
	t, err := time.Parse(time.RFC3339, timeReq)
	if err != nil {
		ro.CustomAbort(400, "wrong date time format")
	}
	timeStamp := primitive.NewDateTimeFromTime(t)

	req := models.RequestInvoiceByTimeStamp{
		OrderID:   objOrderID,
		TimeStamp: timeStamp,
		OrderType: uint(orderType),
	}

	invoiceDetail, err := models.GetInvoiceDetailByTimeStamp(req)
	if err != nil {
		ro.CustomAbort(400, err.Error())
	}
	ro.Data["json"] = invoiceDetail
	err = ro.ServeJSON()
	if err != nil {
		ro.Abort(utils.HotelState[500])
	}
}

// GetStaticsHotelByDate @Title Get Statics By Date
// @Description Get Statics of Hotel By Date
// @Param date path string true "date"
// @Param month path string true "month"
// @Success 200
// @router /order/hotel/statics [get]
func (ro *RoomOrderController) GetStaticsHotelByDate() {
	dayRq := ro.GetString("day")
	monthRq := ro.GetString("month")
	yearRq := ro.GetString("year")
	hotelID := ro.GetString("hotelID")

	//Validate day, month, year and hotelID
	dayRs, err := strconv.ParseUint(dayRq, 10, 64) // Convert string to uint64
	if err != nil {
		ro.CustomAbort(400, "wrong day format")
	}
	monthRs, err := strconv.ParseUint(monthRq, 10, 64) // Convert string to uint64
	if err != nil {
		ro.CustomAbort(400, "wrong month format")
	}
	yearRs, err := strconv.ParseUint(yearRq, 10, 64) // Convert string to uint64
	if err != nil {
		ro.CustomAbort(400, "wrong year format")
	}
	day := uint(dayRs)
	month := uint(monthRs)
	year := uint(yearRs)
	objHotelID, err := primitive.ObjectIDFromHex(hotelID)
	if err != nil {
		ro.CustomAbort(400, "no order with this id")
	}

	// Get order by day and month
	statistics, err := models.GetStatisticsHotelByDayAndMonth(day, month, year, objHotelID)
	if err != nil {
		ro.CustomAbort(404, err.Error())
	}
	ro.Data["json"] = statistics
	err = ro.ServeJSON()
	if err != nil {
		ro.Abort(utils.HotelState[500])
	}
}
