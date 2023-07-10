package models

import (
	"errors"
	"fmt"
	"strings"
	"trebooking/database"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var roomCollection = database.Database.Collection("Room")

const (
	Day     = 0
	WeekDay = 1
	Month   = 2
	Year    = 3
)

type RoomProperties struct {
	RoomNo          string          `bson:"roomNo" json:"roomNo"`
	DayPrice        float32         `bson:"dayPrice" json:"dayPrice"`
	NumberOfBed     uint8           `bson:"numberOfBed" json:"numberOfBed"`
	HourFeePolicies []HourFeePolicy `bson:"hourFeePolicies" json:"hourFeePolicies"`
	Blocked         bool            `bson:"blocked" json:"blocked"`
}

type Room struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	HotelID        primitive.ObjectID `bson:"hotelID,omitempty" json:"hotelID,omitempty"`
	RoomProperties `bson:",inline"`
}

type RequestAvailableRoom struct {
	HotelID  primitive.ObjectID `bson:"hotelID,omitempty"`
	From     primitive.DateTime `bson:"from,omitempty"`
	To       primitive.DateTime `bson:"to,omitempty"`
	MaxGuest uint8              `bson:"maxGuest,omitempty"`
}

type MinRoomPrice struct {
	Value float32 `bson:"minRoomPrice" json:"minRoomPrice"`
}

func GetTime(time primitive.DateTime, timeType int) int {
	switch timeType {
	case Day:
		return time.Time().Day()
	case WeekDay:
		return int(time.Time().Weekday())
	case Month:
		return int(time.Time().Month())
	default:
		return time.Time().Year()
	}
}

func CreatRoom(room Room) (string, error) {
	hotel, err := GetHotelById(room.HotelID)
	room.Blocked = false
	if err != nil {
		return "", err
	}

	//if len(room.HourFeePolicies) == 0 {
	//	return "", errors.New("this room must have hour price policy")
	//}
	hotelWithSameRoomNo, err := roomCollection.CountDocuments(*database.Ctx, bson.M{
		"hotelID": room.HotelID,
		"roomNo":  room.RoomNo,
	})
	if err != nil {
		return "", err
	}
	if hotelWithSameRoomNo > 0 {
		return "", errors.New("room already exists")
	}

	result, err := roomCollection.InsertOne(*database.Ctx, room)
	if err != nil {
		return "", errors.New("error while creating room")
	}

	room.ID = result.InsertedID.(primitive.ObjectID)
	hotel.TotalRoom += 1
	if err := UpdateHotel(room.HotelID, hotel); err != nil {
		return "", err
	}

	var minPrice MinRoomPrice
	minPrice, err = GetMinPriceRoomByHotelID(room.HotelID)
	if err != nil {
		return "", errors.New("error while getting room price")
	}

	hotel.MinRoomPrice = minPrice.Value
	if err := UpdateHotel(room.HotelID, hotel); err != nil {
		return "", errors.New("error while updating hotel price")
	}

	return room.ID.Hex(), nil
}

func GetMinPriceRoomByHotelID(hotelID primitive.ObjectID) (MinRoomPrice, error) {
	findByHotelID := bson.D{{"$match", bson.D{{"hotelID", hotelID}}}}
	filter := bson.D{
		{"$group",
			bson.D{
				{"_id", "$hotelID"},
				{"minRoomPrice", bson.D{{"$min", "$dayPrice"}}},
			},
		},
	}
	var minPriceRoom []MinRoomPrice
	cursor, err := roomCollection.Aggregate(*database.Ctx, mongo.Pipeline{findByHotelID, filter})
	if err != nil {
		panic(err)
	}
	if err := cursor.All(*database.Ctx, &minPriceRoom); err != nil {
		panic(err)
	}
	return minPriceRoom[0], nil
}

func GetAllRoom(hotelID primitive.ObjectID) ([]Room, error) {
	_, err := GetHotelById(hotelID)
	if err != nil {
		return make([]Room, 0), err
	}

	filter := bson.D{
		{Key: "hotelID", Value: hotelID},
	}
	cursor, err := roomCollection.Find(*database.Ctx, filter)
	if err != nil {
		return nil, err
	}
	var rooms []Room
	if err = cursor.All(*database.Ctx, &rooms); err != nil {
		return nil, err
	}
	return rooms, nil
}

func GetPagedRoom(hotelID primitive.ObjectID, offSet int64, maxPerPage int64) ([]Room, error) {
	_, err := GetHotelById(hotelID)
	if err != nil {
		return make([]Room, 0), err
	}

	filter := bson.D{
		{Key: "hotelID", Value: hotelID},
	}
	opts := options.Find().SetSkip(offSet * maxPerPage).SetLimit(maxPerPage)
	cursor, err := roomCollection.Find(*database.Ctx, filter, opts)
	if err != nil {
		return nil, errors.New("error while getting room")
	}
	var rooms []Room
	err = cursor.All(*database.Ctx, &rooms)
	if err != nil {
		return nil, errors.New("error while getting hotel")
	}
	return rooms, nil
}

func DeleteRoom(roomID primitive.ObjectID) error {
	room, err := GetRoomByID(roomID)
	if err != nil {
		return errors.New("no room founded")
	}
	deleteResult, err := roomCollection.DeleteOne(*database.Ctx, bson.M{"_id": roomID})
	if err != nil {
		return errors.New("error while deleting room")
	}
	if deleteResult.DeletedCount == 0 {
		return errors.New("no room deleted")
	}

	hotel, _ := GetHotelById(room.HotelID)
	hotel.TotalRoom -= 1
	if err := UpdateHotel(room.HotelID, hotel); err != nil {
		return err
	}
	return nil
}

func DeleteAllRooms(hotelID primitive.ObjectID) error {
	deleteResult, err := roomCollection.DeleteMany(*database.Ctx, bson.M{"hotelID": hotelID})
	if err != nil {
		return errors.New("error while deleting room")
	}
	if deleteResult.DeletedCount == 0 {
		return errors.New("no room deleted")
	}
	return nil
}

func EditRoom(room Room) error {

	// If user update room number, check if there is a room with the same number
	if room.RoomNo != "" {
		var editingRoom Room
		if err := roomCollection.FindOne(*database.Ctx, bson.M{
			"_id": room.ID,
		}).Decode(&editingRoom); err != nil {
			return errors.New("no room with this id")
		}

		filter := bson.D{
			{Key: "hotelID", Value: editingRoom.HotelID},
			{Key: "roomNo", Value: room.RoomNo},
		}
		oldRoom, _ := GetRoomByID(room.ID)
		hotelWithSameRoomNo, err := roomCollection.CountDocuments(*database.Ctx, filter)

		if err != nil {
			return err
		}

		if hotelWithSameRoomNo > 0 && oldRoom.RoomNo != room.RoomNo {
			return errors.New("room already exists")
		}
	}

	if room.ID == primitive.NilObjectID {
		return errors.New("invalid input: roomID can't be nil")
	}

	count, err := roomCollection.UpdateOne(*database.Ctx, bson.M{"_id": room.ID}, bson.M{"$set": room})
	if count.MatchedCount == 0 {
		return errors.New("no room with this id")
	}
	if err != nil {
		return errors.New("error while editing room")
	}
	return nil
}

func GetRoomByID(roomID primitive.ObjectID) (Room, error) {
	var room Room
	err := roomCollection.FindOne(*database.Ctx, bson.M{"_id": roomID}).Decode(&room)
	if err != nil {
		return room, errors.New("no room with this id")
	}
	return room, nil
}

type specialRoom struct {
	Room
	Status int `json:"status"`
}

func SearchAllRoomAndStatus(hotelID primitive.ObjectID, search string) ([]specialRoom, error) {
	filter := bson.D{
		{Key: "hotelID", Value: hotelID},
		{Key: "roomNo", Value: bson.M{
			"$regex":   fmt.Sprintf(".*%s.*", strings.ReplaceAll(search, "", ".*")),
			"$options": "sixm",
		}},
	}
	return getAllRooms(hotelID, filter)
}

func GetAllRoomAndStatus(hotelID primitive.ObjectID) ([]specialRoom, error) {
	filter := bson.D{
		{Key: "hotelID", Value: hotelID},
	}
	return getAllRooms(hotelID, filter)
}

func GetPagedRoomAndStatus(hotelID primitive.ObjectID, offSet int64, maxPerPage int64) ([]specialRoom, error) {
	filter := bson.D{
		{Key: "hotelID", Value: hotelID},
	}
	opts := options.Find().SetSkip(offSet * maxPerPage).SetLimit(maxPerPage)
	return getAllRooms(hotelID, filter, opts)
}

func getAllRooms(hotelID primitive.ObjectID, filter interface{}, opts ...*options.FindOptions) ([]specialRoom, error) {
	var roomResults []specialRoom
	cursor, err := roomCollection.Find(*database.Ctx, filter, opts...)
	if err != nil {
		return nil, err
	}
	var rooms []Room
	if err = cursor.All(*database.Ctx, &rooms); err != nil {
		return nil, err
	}
	for _, room := range rooms {
		roomOrder, _ := GetCurrentUserByRoomID(room.ID.Hex())
		newRoomResult := specialRoom{Room: room, Status: 0}
		if roomOrder != nil {
			newRoomResult.Status = 1
		}
		roomResults = append(roomResults, newRoomResult)
	}
	return roomResults, nil
}

func DeleteRooms(hotelIDs []primitive.ObjectID) (int, error) {
	filter := bson.D{{"_id", bson.D{{"$in", hotelIDs}}}}
	result, err := roomCollection.DeleteMany(*database.Ctx, filter)
	return int(result.DeletedCount), err
}

func GetCurrentAvailableRooms(hotelID primitive.ObjectID) ([]Room, error) {
	rooms, err := GetAllRoom(hotelID)
	if err != nil {
		return rooms, err
	}
	var availableRooms []Room

	for _, room := range rooms {
		roomOrder, _ := GetCurrentUserByRoomID(room.ID.Hex())
		if roomOrder == nil {
			availableRooms = append(availableRooms, room)
		}
	}
	return availableRooms, nil
}
