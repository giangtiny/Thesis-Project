package models

import (
	"errors"
	"fmt"
	"math"
	"time"
	"trebooking/database"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var holidayCollection = database.Database.Collection("Holiday")

type EventFeeAndPromotion struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	HotelID     primitive.ObjectID `bson:"hotelID,omitempty" json:"hotelID,omitempty"`
	VillaID     primitive.ObjectID `bson:"villaID,omitempty" json:"villaID,omitempty"`
	TownHouseID primitive.ObjectID `bson:"townHouseID,omitempty" json:"townHouseID,omitempty"`
	Name        string             `bson:"name,omitempty" json:"name,omitempty"`
	Date        primitive.DateTime `bson:"date,omitempty" json:"date,omitempty"`
	Fee         float32            `bson:"fee" json:"fee"`
	Promotion   float32            `bson:"promotion" json:"promotion"`
}

func GetHolidayByItemID(id primitive.ObjectID, holidayType int) ([]EventFeeAndPromotion, error) {
	var holidayFees []EventFeeAndPromotion
	cursor, err := holidayCollection.Find(*database.Ctx,
		bson.M{
			arr[holidayType]: id,
		},
	)
	if err != nil {
		return holidayFees, err
	}

	if err := cursor.All(*database.Ctx, &holidayFees); err != nil {
		return holidayFees, err
	}
	return holidayFees, nil

}

func GetHolidayByMonth(id primitive.ObjectID, holidayType int, month int) ([]EventFeeAndPromotion, error) {
	holidayFees, err := GetHolidayByItemID(id, holidayType)
	if err != nil {
		return holidayFees, err
	}
	var result []EventFeeAndPromotion
	for _, holiday := range holidayFees {
		if holiday.Date.Time().Month() == time.Month(month) {
			result = append(result, holiday)
		}
	}
	return result, nil
}

func AddHolidayFee(fee EventFeeAndPromotion, holidayType int) error {
	var count int64
	var err error
	switch holidayType {
	case 0:
		count, err = hotelCollection.CountDocuments(*database.Ctx, bson.M{
			"_id": fee.HotelID,
		})
	case 1:
		count, err = villaTownhouseCollection.CountDocuments(*database.Ctx, bson.M{
			"_id": fee.VillaID,
		})
	case 2:
		count, err = villaTownhouseCollection.CountDocuments(*database.Ctx, bson.M{
			"_id": fee.TownHouseID,
		})
	}

	if err != nil {
		return err
	}
	if count == 0 {
		return fmt.Errorf("no item found with this %s", arr[holidayType])
	}
	_, err = holidayCollection.InsertOne(*database.Ctx, fee)
	if err != nil {
		return err
	}
	return nil
}

func DeleteHolidayFees(feeIDs []primitive.ObjectID) error {
	result, err := holidayCollection.DeleteMany(*database.Ctx, bson.M{
		"_id": bson.M{
			"$in": feeIDs,
		},
	})
	if err != nil {
		return err
	}
	if int(result.DeletedCount) != len(feeIDs) {
		return errors.New("there are some feeID that are not correct")
	}
	return nil
}

func UpdateHolidayFee(feeID primitive.ObjectID, fee EventFeeAndPromotion) error {
	filter := bson.M{
		"_id": feeID,
	}
	update := bson.M{
		"$set": fee,
	}
	result, err := holidayCollection.UpdateOne(*database.Ctx, filter, update)
	if result.MatchedCount == 0 {
		return errors.New("no holiday fee matches this id")
	}
	return err
}

func GetEventFeeAndPromotionByCheckIn(id primitive.ObjectID, holidayType int, checkIn primitive.DateTime) (*EventFeeAndPromotion, error) {
	feeAndPromotions, err := GetHolidayByMonth(id, holidayType, int(checkIn.Time().Month()))
	if err != nil {
		return nil, err
	}
	for _, feeAndPromotion := range feeAndPromotions {
		startEvent := feeAndPromotion.Date
		endEvent := feeAndPromotion.Date.Time().Add(time.Hour * 24)
		if startEvent.Time().Add(-time.Second*1).Before(checkIn.Time()) && checkIn.Time().Before(endEvent) {
			return &feeAndPromotion, nil
		}
	}
	return nil, nil
}

func GetFeeOfOrder(id primitive.ObjectID, holidayType int, checkIn primitive.DateTime) (float64, error) {
	var weekendFee MonthlyFee
	result := monthlyFeeCollection.FindOne(*database.Ctx, bson.M{
		arr[holidayType]: id,
		"month":          checkIn.Time().Month(),
	})
	if err := result.Decode(&weekendFee); err != nil {
		return 0, err
	}
	feeAndPromo, err := GetEventFeeAndPromotionByCheckIn(id, holidayType, checkIn)
	if err != nil {
		return 0, err
	}

	location, err := time.LoadLocation("Asia/Ho_Chi_Minh")
	if err != nil {
		fmt.Println("Error loading location:", err)
	}

	if checkIn.Time().In(location).Weekday() == Sunday {
		if feeAndPromo != nil {
			return math.Max(float64(weekendFee.SundayFee), float64(feeAndPromo.Fee)), nil
		} else {
			return float64(weekendFee.SundayFee), nil
		}
	} else if checkIn.Time().In(location).Weekday() == Saturday {
		if feeAndPromo != nil {
			return math.Max(float64(weekendFee.SaturdayFee), float64(feeAndPromo.Fee)), nil
		}
		return float64(weekendFee.SaturdayFee), nil
	}
	return 0, nil
}
