package models

import (
	"errors"
	"trebooking/database"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type InvoiceDetail struct {
	OrderCode             string                  `bson:"orderCode,omitempty" json:"orderCode,omitempty"`
	UserName              string                  `bson:"userName" json:"userName"`
	Gmail                 string                  `bson:"gmail" json:"gmail"`
	PhoneNumber           string                  `bson:"phoneNumber" json:"phoneNumber"`
	NameOfHotel           string                  `bson:"nameOfHotel" json:"nameOfHotel"`
	IdOfHotel             primitive.ObjectID      `bson:"idOfHotel,omitempty" json:"idOfHotel,omitempty"`
	PhoneNumberOfBusiness string                  `bson:"phoneNumberOfBusiness" json:"phoneNumberOfBusiness"`
	RoomInvoiceProperties []RoomInvoiceProperties `bson:"rooms" json:"rooms"`
	Address               string                  `bson:"address" json:"address"`
	RoomInvoiceSurCharges []RoomInvoiceSurCharge  `bson:"surcharges" json:"surcharges"`
	Price                 float32                 `bson:"price" json:"price"`
	TotalSurCharge        float32                 `bson:"totalSurCharge" json:"totalSurCharge"`
	VAT                   float32                 `bson:"vat" json:"vat"` // For VAT invoice
	VATInPrice            float32                 `bson:"vatInPrice" json:"vatInPrice"`
	TotalPrice            float32                 `bson:"totalPrice" json:"totalPrice"`
	OrderType             uint                    `bson:"orderType" json:"orderType"`
	TotalTime             int                     `bson:"totalTime" json:"totalTime"`
	Discount              float32                 `bson:"discount" json:"discount"`
	PaidDeposit           float32                 `bson:"paidDeposit" json:"paidDeposit"`
	MustPayDeposit        float32                 `bson:"mustPayDeposit" json:"mustPayDeposit"`
	Remain                float32                 `bson:"remain" json:"remain"`
}

type RoomInvoiceProperties struct {
	RoomID  primitive.ObjectID `bson:"roomId,omitempty" json:"roomId,omitempty"`
	RoomNo  string             `bson:"roomNo" json:"roomNo"`
	RoomFee float32            `bson:"roomFee" json:"roomFee"`
}

type RoomInvoiceSurCharge struct {
	RoomSurcharge  `bson:",inline"`
	TotalSurCharge float32 `bson:"totalSurCharge" json:"totalSurCharge"`
}

type RequestInvoiceByTimeStamp struct {
	OrderID   primitive.ObjectID `bson:"orderID,omitempty" json:"orderID,omitempty"`
	TimeStamp primitive.DateTime `bson:"timeStamp" json:"timeStamp"`
	OrderType uint               `bson:"orderType" json:"orderType"`
}

// --------------- Invoice detail -----------------------------

func GetInvoiceDetailByTimeStamp(stamp RequestInvoiceByTimeStamp) (InvoiceDetail, error) {
	var invoice InvoiceDetail
	var hourOrder HourRoomOrder
	var dayOrder DayRoomOrder
	var roomOrder RoomOrder
	var totalTime int

	result := roomOrderCollection.FindOne(*database.Ctx, bson.M{
		"_id":       stamp.OrderID,
		"orderType": stamp.OrderType,
	})

	if stamp.OrderType == 0 {
		if err := result.Decode(&hourOrder); err != nil {
			return invoice, errors.New("no order with this id and this order type")
		}
		hourOrder.CheckOut = stamp.TimeStamp
		hOrder, err := SetPriceOfHourOrder(hourOrder)
		hourOrder = hOrder
		roomOrder = hourOrder.RoomOrder

		if err != nil {
			return invoice, err
		}
		totalTime = GetTotalHourOfHourOrder(&hourOrder)

	} else {
		if err := result.Decode(&dayOrder); err != nil {
			return invoice, errors.New("no order with this id and this order type")
		}
		roomOrder.CheckOut = stamp.TimeStamp
		dOrder, err := SetPriceOfDayOrder(dayOrder)
		if err != nil {
			return invoice, err
		}

		dayOrder = dOrder
		roomOrder = dayOrder.RoomOrder

		totalTime = GetTotalDayOfDayOrder(&dayOrder)
	}

	return SetInvoiceDetail(hourOrder, dayOrder, invoice, totalTime, roomOrder)
}

func GetInvoiceDetailByDefault(orderID primitive.ObjectID, orderType int) (InvoiceDetail, error) {
	var invoice InvoiceDetail
	var hourOrder HourRoomOrder
	var dayOrder DayRoomOrder
	var totalTime int
	var roomOrder RoomOrder

	result := roomOrderCollection.FindOne(*database.Ctx, bson.M{
		"_id":       orderID,
		"orderType": orderType,
	})

	if orderType == 0 {
		if err := result.Decode(&hourOrder); err != nil {
			return invoice, errors.New("no order with this id and this order type")
		}
		roomOrder = hourOrder.RoomOrder
		totalTime = GetTotalHourOfHourOrder(&hourOrder)
	} else {
		if err := result.Decode(&dayOrder); err != nil {
			return invoice, errors.New("no order with this id and this order type")
		}
		roomOrder = dayOrder.RoomOrder
		totalTime = GetTotalDayOfDayOrder(&dayOrder)
	}
	return SetInvoiceDetail(hourOrder, dayOrder, invoice, totalTime, roomOrder)
}

func TotalSurCharges(roomOrder RoomOrder) (float32, []RoomInvoiceSurCharge) {
	totalSurCharges := float32(0)
	var roomInvoiceSurcharges []RoomInvoiceSurCharge
	for _, surcharge := range roomOrder.RoomSurcharges {
		var roomInvoiceSurcharge RoomInvoiceSurCharge
		roomInvoiceSurcharge.RoomSurcharge = surcharge
		roomInvoiceSurcharge.TotalSurCharge = float32(surcharge.Price * surcharge.Quantity)
		roomInvoiceSurcharges = append(roomInvoiceSurcharges, roomInvoiceSurcharge)
		totalSurCharges += roomInvoiceSurcharge.TotalSurCharge
	}
	return totalSurCharges, roomInvoiceSurcharges
}

func SetInvoiceDetail(hourOrder HourRoomOrder, dayOrder DayRoomOrder, invoice InvoiceDetail, totalTime int, roomOrder RoomOrder) (InvoiceDetail, error) {
	var roomInvoiceProperties []RoomInvoiceProperties
	var rooms []Room
	var eventFeeAndPromotion *EventFeeAndPromotion
	discount := float32(0)
	priceBeforePromotion := float32(0)
	vatInPrice := float32(0)
	promotion := float32(0)

	totalSurCharges, roomInvoiceSurcharges := TotalSurCharges(roomOrder)

	cursor, err := roomCollection.Find(*database.Ctx, bson.M{
		"_id": bson.M{
			"$in": roomOrder.RoomIDs,
		},
	})

	if err != nil {
		return invoice, err
	}

	if err := cursor.All(*database.Ctx, &rooms); err != nil {
		return invoice, err
	}

	if roomOrder.OrderType == 0 {
		priceBeforePromotion, _ = CalculateTotalHourPrice(&hourOrder)
	} else {
		priceBeforePromotion, _ = CalculateTotalDayPrice(&dayOrder)
	}

	if err != nil {
		return invoice, err
	}
	eventFeeAndPromotion, err = GetEventFeeAndPromotionByCheckIn(roomOrder.HotelID, 0, roomOrder.CheckIn)
	if err != nil {
		return invoice, err
	}
	if eventFeeAndPromotion != nil {
		promotion = eventFeeAndPromotion.Promotion
	}

	priceAfterPromotion := priceBeforePromotion * (1 - promotion)
	vatInPrice = priceAfterPromotion * roomOrder.VAT
	if roomOrder.TypeOfDiscount == Percentage {
		discount = roomOrder.DiscountInPercentage * priceAfterPromotion
	} else {
		discount = roomOrder.DiscountInCash
	}

	totalPrice := priceAfterPromotion + vatInPrice + totalSurCharges
	remain := totalPrice - roomOrder.PaidDeposit - discount

	invoice.OrderCode = "Coming soon"
	invoice.UserName = roomOrder.UserName
	invoice.Gmail = roomOrder.Gmail
	invoice.PhoneNumber = roomOrder.PhoneNumber
	hotel, err := GetHotelById(roomOrder.HotelID)
	if err != nil {
		return invoice, err
	}
	invoice.NameOfHotel = hotel.Name
	invoice.IdOfHotel = roomOrder.HotelID
	invoice.PhoneNumberOfBusiness = "Coming soon"
	//Rooms of hotel
	for _, roomID := range roomOrder.RoomIDs {
		var roomInvoiceProperty RoomInvoiceProperties
		room, _ := GetRoomByID(roomID)
		roomInvoiceProperty.RoomID = room.ID
		roomInvoiceProperty.RoomNo = room.RoomNo
		roomInvoiceProperty.RoomFee = room.DayPrice
		roomInvoiceProperties = append(roomInvoiceProperties, roomInvoiceProperty)
	}
	invoice.RoomInvoiceProperties = roomInvoiceProperties
	invoice.RoomInvoiceSurCharges = roomInvoiceSurcharges
	invoice.Address = hotel.Address
	invoice.Price = priceAfterPromotion
	invoice.TotalSurCharge = totalSurCharges
	invoice.VAT = roomOrder.VAT
	invoice.VATInPrice = vatInPrice
	invoice.OrderType = roomOrder.OrderType
	invoice.TotalPrice = totalPrice
	invoice.TotalTime = totalTime
	invoice.Discount = discount
	invoice.PaidDeposit = roomOrder.PaidDeposit
	invoice.MustPayDeposit = priceAfterPromotion * hotel.Deposit
	invoice.Remain = remain
	return invoice, nil
}
