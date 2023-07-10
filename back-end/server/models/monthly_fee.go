package models

import (
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"trebooking/database"
)

const (
	HotelFee     = 0
	VillaFee     = 1
	TownHouseFee = 2
)

var arr = [3]string{"hotelID", "villaID", "townHouseID"}

var monthlyFeeCollection = database.Database.Collection("MonthlyFee")

type MonthlyFee struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	HotelID      primitive.ObjectID `bson:"hotelID,omitempty" json:"hotelID,omitempty"`
	VillaID      primitive.ObjectID `bson:"villaID,omitempty" json:"villaID,omitempty"`
	TownHouseID  primitive.ObjectID `bson:"townHouseID,omitempty" json:"townHouseID,omitempty"`
	FeeType      int                `bson:"feeType" json:"feeType"`
	Month        int                `bson:"month" json:"month"`
	SundayFee    float32            `bson:"sundayFee" json:"sundayFee"`
	SaturdayFee  float32            `bson:"saturdayFee" json:"saturdayFee"`
	NormalDayFee float32            `bson:"normalDayFee" json:"normalDayFee"`
}

func GetMonthlyFeeByFeeID(feeID primitive.ObjectID) (MonthlyFee, error) {
	var fee MonthlyFee
	result := monthlyFeeCollection.FindOne(*database.Ctx, bson.M{
		"_id": feeID,
	})
	if err := result.Decode(&fee); err != nil {
		return fee, errors.New("no fee with this id")
	}
	return fee, nil
}

func GetMonthlyFee(id primitive.ObjectID, feeType int) ([]MonthlyFee, error) {
	filter := bson.M{
		arr[feeType]: id,
	}
	var fee []MonthlyFee
	cursor, err := monthlyFeeCollection.Find(*database.Ctx, filter)
	if err != nil {
		return fee, err
	}
	if err := cursor.All(*database.Ctx, &fee); err != nil {
		return fee, errors.New("there is no monthly fee for this " + arr[feeType])
	}

	return fee, nil
}

func GetMonthlyFeeByMonth(month int, id primitive.ObjectID, feeType int) (MonthlyFee, error) {
	var fee MonthlyFee
	result := monthlyFeeCollection.FindOne(*database.Ctx, bson.M{
		arr[feeType]: id,
		"month":      month,
	})
	if err := result.Decode(&fee); err != nil {
		return fee, errors.New("there is no monthly fee for this " + arr[feeType])
	}
	return fee, nil
}

func UpdateMonthlyFee(newFee MonthlyFee, id primitive.ObjectID) error {
	if newFee.Month > 12 || newFee.Month < 1 {
		return errors.New("this month is invalid")
	}
	result, err := monthlyFeeCollection.UpdateOne(*database.Ctx, bson.M{
		"month":             newFee.Month,
		arr[newFee.FeeType]: id,
	}, bson.M{
		"$set": newFee,
	})

	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return errors.New("id is not correct or this month has no fee yet")
	}
	return nil
}

func AddMonthlyFee(newFee MonthlyFee, id primitive.ObjectID) error {
	if newFee.Month > 12 || newFee.Month < 1 {
		return errors.New("this month is invalid")
	}

	count, err := monthlyFeeCollection.CountDocuments(*database.Ctx, bson.M{
		"month":             newFee.Month,
		arr[newFee.FeeType]: id,
	})
	if err != nil {
		return err
	}
	if count > 0 {
		if err := UpdateMonthlyFee(newFee, id); err != nil {
			return err
		}
	} else {
		_, err = monthlyFeeCollection.InsertOne(*database.Ctx, newFee)
		if err != nil {
			return err
		}
	}
	return nil
}

func CreateDayPrices(id primitive.ObjectID, typeOfId int) error {
	dayPrices := make([]interface{}, 12)
	for i := 0; i < 12; i++ {
		dayPrices[i] = bson.M{
			arr[typeOfId]:  id,
			"month":        i + 1,
			"sundayFee":    0,
			"saturdayFee":  0,
			"normalDayFee": 0,
		}
	}
	_, err := monthlyFeeCollection.InsertMany(*database.Ctx, dayPrices)
	if err != nil {
		return err
	}
	return nil
}
