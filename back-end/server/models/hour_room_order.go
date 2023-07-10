package models

import (
	"errors"
	"math"
	"time"
	"trebooking/database"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func CreateHourRoomOrder(hourOrder HourRoomOrder) (HourRoomOrder, error) {
	if err := ValidateHourRoomOrder(hourOrder); err != nil {
		return hourOrder, err
	}

	hourOrder, err := SetPriceOfHourOrder(hourOrder)
	if err != nil {
		return hourOrder, err
	}

	result, err := roomOrderCollection.InsertOne(*database.Ctx, hourOrder)
	if err != nil {
		return hourOrder, err
	}

	hourOrder.ID = result.InsertedID.(primitive.ObjectID)
	return hourOrder, nil
}

func CalculatePriceHourRoomOrder(hourOrder HourRoomOrder) (HourRoomOrder, error) {
	if err := ValidateHourRoomOrder(hourOrder); err != nil {
		return hourOrder, err
	}
	hourOrder, err := SetPriceOfHourOrder(hourOrder)
	if err != nil {
		return hourOrder, err
	}
	return hourOrder, nil
}

/*
ValidateHourRoomOrder
Validate fields before creating order
*/
func ValidateHourRoomOrder(order HourRoomOrder) error {
	if len(order.RoomIDs) > 1 {
		return errors.New("hour order can only book 1 room")
	}

	if err := ValidateRoomOrder(order.RoomOrder); err != nil {
		return err
	}
	return nil
}

func UpdateHourRoomOrder(orderID primitive.ObjectID, hourOrder HourRoomOrder) error {
	if hourOrder.OrderType == 1 {
		return errors.New("cant change order type to day order")
	}

	if len(hourOrder.RoomIDs) > 1 {
		return errors.New("hour order cant book more than 1 room")
	}

	oldOrder, err := GetOrderByOrderID(orderID)
	if err != nil {
		return err
	}
	var updatedOrder HourRoomOrder
	if err := roomOrderCollection.FindOneAndUpdate(*database.Ctx, bson.M{"_id": orderID}, bson.M{
		"$set": hourOrder,
	}, options.FindOneAndUpdate().SetReturnDocument(options.After)).Decode(&updatedOrder); err != nil {
		return errors.New("no order with this id")
	}

	if IsOverlap(updatedOrder.RoomOrder, true) {
		roomOrderCollection.UpdateOne(*database.Ctx, bson.M{"_id": orderID}, bson.M{
			"$set": oldOrder,
		})
	}

	updatedOrder, err = SetPriceOfHourOrder(updatedOrder)
	if err != nil {
		return err
	}

	result, err := roomOrderCollection.UpdateOne(*database.Ctx, bson.M{"_id": orderID}, bson.M{
		"$set": updatedOrder,
	})

	if err != nil {
		return err
	}
	if result.MatchedCount == 0 {
		return errors.New("no document modified")
	}
	return nil
}

/*
CalculateTotalHourPrice
Calculate total price of price order base on price in 1 hour
*/
func CalculateTotalHourPrice(hourOrder *HourRoomOrder) (float32, error) {
	totalRentHour := float64(GetTotalHourOfHourOrder(hourOrder))
	priceBeforeTax := float64(0)

	for _, roomID := range hourOrder.RoomIDs {
		rentHour := totalRentHour
		room, _ := GetRoomByID(roomID)
		priceBeforeTax += CalculatePriceByHourPolicies(rentHour, room.HourFeePolicies)
	}
	return float32(priceBeforeTax), nil
}

/*
CalculatePriceByHourPolicies
When user order room by hour, the price in 1 hour is calculated
by hour policies of hotel
*/
func CalculatePriceByHourPolicies(totalRentHour float64, feePolicy []HourFeePolicy) float64 {
	priceBeforeTax := float64(0)
	index := 0
	for totalRentHour > 0 {
		if uint(totalRentHour) <= feePolicy[index].Hour {
			priceBeforeTax += totalRentHour * feePolicy[index].Fee
			break
		} else {
			priceBeforeTax += float64(feePolicy[index].Hour) * feePolicy[index].Fee
			totalRentHour -= float64(feePolicy[index].Hour)
			if index+1 < len(feePolicy) {
				index += 1
			}
		}
	}
	return priceBeforeTax
}

func SetPriceOfHourOrder(hourOrder HourRoomOrder) (HourRoomOrder, error) {
	totalHour := uint(GetTotalHourOfHourOrder(&hourOrder))
	hourOrder.RoomOrder = SetDepositOfOrder(0, 0, hourOrder.RoomOrder)

	// User can only book room for less than MaxHour,
	// if exceed MaxHour, the price would be changed day price
	if totalHour > hourOrder.MaxHour {
		room, err := GetRoomByID(hourOrder.RoomIDs[0])
		if err != nil {
			return hourOrder, err
		}
		// calculate interval time
		checkIn := hourOrder.CheckIn
		//checkOut := hourOrder.CheckOut
		//interval := checkOut.Time().Sub(checkIn.Time())
		//hourOrder.NumHourPassed = interval.String()
		currentTime := hourOrder.CurrentTime
		interval := currentTime.Time().Sub(checkIn.Time())
		hourOrder.NumHourPassed = interval.String()
		// calculate price
		monthlyFee, err := GetMonthlyFeeByMonth(GetTime(hourOrder.CheckIn, Month), room.HotelID, HotelFee)
		if err != nil {
			return hourOrder, err
		}
		dayPrice := room.DayPrice * (1 + monthlyFee.NormalDayFee)
		hourOrder.RoomOrder.RoomPrice = dayPrice
		hourOrder.TotalPrice, err = ApplyDiscountSurChargeAndVAT(dayPrice, &hourOrder.RoomOrder)
		if err != nil {
			return hourOrder, err
		}
	} else {
		// calculate interval time
		checkIn := hourOrder.CheckIn
		//checkOut := hourOrder.CheckOut
		//interval := checkOut.Time().Sub(checkIn.Time())
		//hourOrder.NumHourPassed = interval.String()
		currentTime := hourOrder.CurrentTime
		interval := currentTime.Time().Sub(checkIn.Time())
		hourOrder.NumHourPassed = interval.String()
		// calculate price
		priceBeforeDiscount, err := CalculateTotalHourPrice(&hourOrder)
		hourOrder.RoomOrder.RoomPrice = priceBeforeDiscount
		if err != nil {
			return hourOrder, err
		}
		totalPrice, err := ApplyDiscountSurChargeAndVAT(priceBeforeDiscount, &hourOrder.RoomOrder)
		if err != nil {
			return hourOrder, err
		}
		hourOrder.TotalPrice = totalPrice
	}

	hourOrder.RoomOrder = CalculateRemain(hourOrder.RoomOrder)
	return hourOrder, nil
}

/*
GetTotalHourOfHourOrder
Calculate total hours of order
*/
func GetTotalHourOfHourOrder(hourOrder *HourRoomOrder) int {
	if hourOrder.CheckOut == 0 {
		hourOrder.CheckOut = primitive.NewDateTimeFromTime(hourOrder.CheckIn.Time().Add(time.Hour * 22))
	}
	//interval := hourOrder.RoomOrder.CheckOut.Time().Sub(hourOrder.RoomOrder.CheckIn.Time())
	interval := hourOrder.CurrentTime.Time().Sub(hourOrder.RoomOrder.CheckIn.Time())
	totalRentHour := math.Floor(interval.Hours())
	_, float := math.Modf(interval.Hours())
	remainMinutes := int(float * 60)
	if remainMinutes > 15 {
		totalRentHour += 1
	}
	return int(totalRentHour)
}
