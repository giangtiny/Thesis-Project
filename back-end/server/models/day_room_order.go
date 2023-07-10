package models

import (
	"errors"
	"fmt"
	"math"
	"time"
	"trebooking/database"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func CreateDayRoomOrder(roomOrder DayRoomOrder, prp PaymentResponsePayload) (DayRoomOrder, error) {
	roomOrder.OrderType = 1
	roomOrder.PaidDeposit = prp.Amount
	if err := ValidateDayRoomOrder(roomOrder); err != nil {
		return roomOrder, err
	}
	roomOrder, err := SetPriceOfDayOrder(roomOrder)
	if err != nil {
		return roomOrder, err
	}
	result, err := roomOrderCollection.InsertOne(*database.Ctx, roomOrder)
	if err != nil {
		return roomOrder, err
	}

	roomOrder.ID = result.InsertedID.(primitive.ObjectID)

	// update user's ReviewCount
	user, err := GetUserByPhoneNumber(roomOrder.PhoneNumber)
	if err == nil {
		user.ReviewCount = user.ReviewCount + 1
		UpdateUserByPhonenumber(roomOrder.PhoneNumber, user)
	}

	return roomOrder, nil
}

func CalculatePriceDayRoomOrder(roomOrder DayRoomOrder) (DayRoomOrder, error) {
	roomOrder.OrderType = 1
	if err := ValidateDayRoomOrder(roomOrder); err != nil {
		return roomOrder, err
	}
	roomOrder, err := SetPriceOfDayOrder(roomOrder)
	if err != nil {
		return roomOrder, err
	}
	return roomOrder, nil
}

/*
ValidateDayRoomOrder
Validate fields before creating order
*/
func ValidateDayRoomOrder(roomOrder DayRoomOrder) error {
	hotel, err := GetHotelById(roomOrder.HotelID)
	if err != nil {
		return err
	}
	maxRoom := hotel.DayOrderMaxRoom
	if !roomOrder.IsGroupOrder && len(roomOrder.RoomIDs) > maxRoom {
		return errors.New(fmt.Sprintf("non-group order can't order more than %d rooms", maxRoom))
	}
	if err := ValidateRoomOrder(roomOrder.RoomOrder); err != nil {
		return err
	}
	return nil
}

func UpdateDayRoomOrder(orderID primitive.ObjectID, dayOrder DayRoomOrder) error {
	oldOrder, err := GetOrderByOrderID(orderID)
	if err != nil {
		return err
	}
	var updatedOrder DayRoomOrder
	if err := roomOrderCollection.FindOneAndUpdate(*database.Ctx, bson.M{"_id": orderID}, bson.M{
		"$set": dayOrder,
	}, options.FindOneAndUpdate().SetReturnDocument(options.After)).Decode(&updatedOrder); err != nil {
		return err
	}
	if IsOverlap(updatedOrder.RoomOrder, true) {
		roomOrderCollection.UpdateOne(*database.Ctx, bson.M{"_id": orderID}, bson.M{
			"$set": oldOrder,
		})
		return errors.New("room is not available at this time, can not update")
	}
	updatedOrder, err = SetPriceOfDayOrder(updatedOrder)
	if err != nil {
		return err
	}
	filter := bson.M{"_id": orderID}
	update := bson.M{
		"$set": updatedOrder,
	}
	result, err := roomOrderCollection.UpdateOne(*database.Ctx, filter, update)
	if err != nil {
		return err
	}
	if result.ModifiedCount == 0 {
		//return errors.New("no document modified")
	}

	return nil
}

func SetPriceOfDayOrder(dayOrder DayRoomOrder) (DayRoomOrder, error) {
	sum, err := CalculateDayDeposit(&dayOrder)
	if err != nil {
		return dayOrder, err
	}
	dayOrder.MustPayDeposit = sum
	priceBeforeDiscount, err := CalculateTotalDayPrice(&dayOrder)
	if err != nil {
		return dayOrder, err
	}
	dayOrder.RoomPrice = priceBeforeDiscount
	totalPrice, err := ApplyDiscountSurChargeAndVAT(priceBeforeDiscount, &dayOrder.RoomOrder)
	if err != nil {
		return dayOrder, err
	}
	dayOrder.TotalPrice = totalPrice
	dayOrder.RoomOrder = CalculateRemain(dayOrder.RoomOrder)
	return dayOrder, nil
}

/*
CalculateTotalDayPrice
Calculate total day price before apply discount,...
*/
func CalculateTotalDayPrice(dayOrder *DayRoomOrder) (float32, error) {
	totalDay := GetTotalDayOfDayOrder(dayOrder)
	var rooms []Room
	cursor, err := roomCollection.Find(*database.Ctx, bson.M{"_id": bson.M{"$in": dayOrder.RoomIDs}})
	if err != nil {
		return 0, err
	}
	if err := cursor.All(*database.Ctx, &rooms); err != nil {
		return 0, err
	}
	totalRoomsPrice := float32(0)
	checkIn := dayOrder.CheckIn
	for i := 0; i < totalDay; i++ {
		fee, err := GetFeeOfOrder(dayOrder.HotelID, 0, checkIn)
		if err != nil {
			return float32(fee), err
		}
		for _, room := range rooms {
			normalFee, err := GetMonthlyFeeByMonth(GetTime(checkIn, Month), room.HotelID, HotelFee)
			if err != nil {
				return 0, err
			}
			location, err := time.LoadLocation("Asia/Ho_Chi_Minh")
			if err != nil {
				fmt.Println("Error loading location:", err)
			}
			if !(checkIn.Time().In(location).Weekday() == Sunday || checkIn.Time().In(location).Weekday() == Saturday) {
				totalRoomsPrice = room.DayPrice * (1 + normalFee.NormalDayFee)
			} else {
				totalRoomsPrice += room.DayPrice * (1 + normalFee.NormalDayFee) * float32(1+fee)
			}
		}
		checkIn = primitive.NewDateTimeFromTime(checkIn.Time().Add(time.Hour * 24))
	}
	return totalRoomsPrice, nil
}

func CalculateDayDeposit(dayOrder *DayRoomOrder) (float32, error) {
	hotel, err := GetHotelById(dayOrder.HotelID)
	if err != nil {
		return 0, err
	}
	var rooms []Room
	cursor, err := roomCollection.Find(*database.Ctx, bson.M{"_id": bson.M{"$in": dayOrder.RoomIDs}})
	if err != nil {
		return 0, err
	}
	if err := cursor.All(*database.Ctx, &rooms); err != nil {
		return 0, err
	}
	sum := float32(0)

	totalDay := GetTotalDayOfDayOrder(dayOrder)
	checkIn := dayOrder.CheckIn
	for i := 0; i < totalDay; i++ {
		feeAndPromotion, err := GetEventFeeAndPromotionByCheckIn(dayOrder.HotelID, 0, checkIn)
		if err != nil {
			return 0, err
		}
		for _, room := range rooms {
			normalFee, err := GetMonthlyFeeByMonth(GetTime(checkIn, Month), room.HotelID, HotelFee)

			dayPrice := room.DayPrice * (1 + normalFee.NormalDayFee)
			if err != nil {
				return 0, err
			}
			if feeAndPromotion == nil {
				sum += dayPrice * hotel.Deposit
			} else {
				sum += dayPrice * hotel.Deposit * (1 - feeAndPromotion.Promotion)
			}
		}
		checkIn = primitive.NewDateTimeFromTime(checkIn.Time().Add(time.Hour * 24))
	}
	return sum, nil
}

func GetTotalDayOfDayOrder(dayOrder *DayRoomOrder) int {
	interval := dayOrder.RoomOrder.CheckOut.Time().Sub(dayOrder.RoomOrder.CheckIn.Time())
	totalRentHour := int(math.Floor(interval.Hours())) + 2
	totalDay := totalRentHour / 24
	return totalDay
}
