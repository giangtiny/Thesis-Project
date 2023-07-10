package models

import (
	"encoding/json"
	"errors"
	"mime/multipart"
	"strconv"
	"time"
	"trebooking/database"
	"trebooking/services/fileio"
	"trebooking/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var hotelCollection = database.Database.Collection("Hotel")

type Hotel struct {
	ID                   primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	OwnerID              primitive.ObjectID `bson:"ownerID,omitempty" json:"ownerID,omitempty"`
	Name                 string             `bson:"name" json:"name"`
	Address              string             `bson:"address" json:"address"`
	Description          string             `bson:"description" json:"description"`
	Images               []string           `bson:"images" json:"images"`
	Star                 float32            `bson:"star" json:"star"`
	TotalRoom            int64              `bson:"totalRoom" json:"totalRoom"`
	DayOrderMaxRoom      int                `bson:"dayOrderMaxRoom" json:"dayOrderMaxRoom"`
	PromotionDescription string             `bson:"promotionDescription" json:"promotionDescription"`
	NeedToContact        bool               `bson:"needToContact" json:"needToContact"`
	Amenities            []Amenity          `bson:"amenities" json:"amenities"`
	// Ranking from customer's review
	Rank         float32  `bson:"rank" json:"rank"`
	ContactInfor string   `bson:"contactInfor" json:"contactInfor"`
	MinRoomPrice float32  `bson:"minRoomPrice" json:"minRoomPrice"`
	Image360     []string `bson:"images360" json:"images360"`
	Lat          float32  `bson:"lat" json:"lat"`
	Lng          float32  `bson:"lng" json:"lng"`
	// Fee for all rooms of hotel
	Deposit float32 `bson:"deposit" json:"deposit"` // deposit of all rooms of hotel, %
}

func CreateHotel(hotel Hotel) (Hotel, error) {

	hotelId, err := hotelCollection.InsertOne(*database.Ctx, hotel)
	if err != nil {
		return Hotel{}, err
	}

	objHotelID := hotelId.InsertedID.(primitive.ObjectID)
	hotel.ID = objHotelID

	totalRoom, err := roomCollection.CountDocuments(*database.Ctx, bson.M{
		"hotelID": objHotelID,
	})

	hotel.TotalRoom = totalRoom

	//Create prices of 12 months and special days for hotel
	if err != CreateDayPrices(objHotelID, 0) {
		return hotel, err
	}
	if err := UpdateHotel(objHotelID, hotel); err != nil {
		return hotel, err
	}
	return hotel, err
}

func GetPagedHotel(offSet int64, maxPerPage int64) ([]Hotel, error) {
	filter := bson.D{}
	opts := options.Find().SetSkip(offSet).SetLimit(maxPerPage)
	cursor, err := hotelCollection.Find(*database.Ctx, filter, opts)
	if err != nil {
		return nil, errors.New("error while getting hotel")
	}
	var hotels []Hotel
	for cursor.Next(*database.Ctx) {
		var hotel Hotel
		cursor.Decode(&hotel)
		hotels = append(hotels, hotel)
	}
	return hotels, nil
}

func DeleteHotel(id string) error {
	objID, _ := primitive.ObjectIDFromHex(id)
	var hotel Hotel
	hotelResult := hotelCollection.FindOne(*database.Ctx, bson.M{"_id": objID})
	if err := hotelResult.Decode(&hotel); err != nil {
		return errors.New("no hotel with this id")
	}
	DeleteAllRooms(hotel.ID)
	fileio.RemoveImages(hotel.Images)
	_, err := hotelCollection.DeleteOne(*database.Ctx, bson.M{"_id": objID})
	if err != nil {
		return errors.New("error while deleting hotel")
	}
	return nil
}

func UpdateHotel(hotelID primitive.ObjectID, newHotel Hotel) error {
	updatedHotel, err := hotelCollection.UpdateOne(*database.Ctx, bson.M{"_id": hotelID}, bson.M{"$set": newHotel})
	if err != nil {
		return err
	}
	if updatedHotel.MatchedCount == 0 {
		return errors.New("no hotel updated")
	}
	return nil
}

func GetAllHotel() ([]Hotel, error) {
	filter := bson.D{}
	cursor, err := hotelCollection.Find(*database.Ctx, filter)

	if err != nil {
		return nil, errors.New("error while getting hotel")
	}

	var hotels []Hotel
	for cursor.Next(*database.Ctx) {
		var hotel Hotel
		cursor.Decode(&hotel)
		totalRoom, _ := roomCollection.CountDocuments(*database.Ctx, bson.M{"hotelID": hotel.ID})

		hotel.TotalRoom = totalRoom
		if hotel.Images == nil {
			hotel.Images = []string{}
		}
		hotels = append(hotels, hotel)
	}
	return hotels, nil
}

func GetHotelById(hotelID primitive.ObjectID) (Hotel, error) {
	result := hotelCollection.FindOne(*database.Ctx, bson.M{"_id": hotelID})

	var hotel Hotel
	if err := result.Decode(&hotel); err != nil {
		return hotel, errors.New("no hotel with this id")
	}

	// var comments []Comment
	// cursor, err := commentCollection.Find(*database.Ctx, bson.M{"hotelID": hotelID})
	// if err != nil {
	// 	return hotel, errors.New("error while getting comment")
	// }
	// if cursor.All(*database.Ctx, &comments); comments == nil {
	// 	comments = []Comment{}
	// }
	if hotel.Images == nil {
		hotel.Images = []string{}
	}

	return hotel, nil
}

func GetHotelsByOwner(ownerID primitive.ObjectID) ([]Hotel, error) {
	result, err := hotelCollection.Find(*database.Ctx, bson.M{"ownerID": ownerID})
	if err != nil {
		return nil, err
	}
	var hotels []Hotel
	if err := result.All(*database.Ctx, &hotels); err != nil {
		return nil, err
	}

	return hotels, nil
}

func AddImagesHotel(id string, fileUploads []*multipart.FileHeader, typeImage string) error {
	var images []string
	for _, fileUpload := range fileUploads {
		images = append(images, fileUpload.Filename)
	}
	hotelID, _ := primitive.ObjectIDFromHex(id)
	_, err := hotelCollection.UpdateOne(*database.Ctx, bson.M{"_id": hotelID}, bson.M{"$push": bson.M{typeImage: bson.M{"$each": images}}})
	if err != nil {
		return err
	}
	return nil
}

func RemoveImagesHotel(id string, imageNames []string, typeImage string) error {
	hotelID, _ := primitive.ObjectIDFromHex(id)
	_, err := hotelCollection.UpdateOne(*database.Ctx, bson.M{"_id": hotelID}, bson.M{"$pull": bson.M{typeImage: bson.M{"$in": imageNames}}})
	if err != nil {
		return err
	}
	return nil
}

func GetHotelsByAddress(searchAddress string) ([]Hotel, error) {
	filter := bson.M{"address": bson.M{"$regex": searchAddress, "$options": "i"}}

	result, err := hotelCollection.Find(*database.Ctx, filter)
	if err != nil {
		return nil, err
	}

	var hotels []Hotel
	if err := result.All(*database.Ctx, &hotels); err != nil {
		return nil, err
	}

	return hotels, nil
}

func GetAvailableHotels(searchAddress string, checkin string, checkout string, maxGuest uint8) ([]Hotel, error) {
	hotels, err := GetHotelsByAddress(searchAddress)
	result := make([]Hotel, 0, len(hotels))
	if err != nil {
		return result, err
	}
	if hotels == nil {
		return result, err
	}

	for _, hotel := range hotels {
		bodyJson := []byte(`{"hotelID": "` + hotel.ID.Hex() + `", "from": "` + checkin + `", "to": "` + checkout + `", "maxGuest": ` + strconv.Itoa(int(maxGuest)) + `}`)
		var requestAvailableRoom RequestAvailableRoom
		if err := json.Unmarshal(bodyJson, &requestAvailableRoom); err != nil {
			return result, errors.New("request error: " + err.Error())
		}

		isValid, _ := utils.ValidateAPI(
			utils.ValidateCheckInCheckOutTime(requestAvailableRoom.From, requestAvailableRoom.To),
		)
		if !isValid {
			return result, err
		}

		availableRooms, err := GetAvailableRooms(requestAvailableRoom)
		if err != nil {
			return result, err
		}
		if len(availableRooms) > 0 {
			result = append(result, hotel)
		}
	}

	return result, nil
}

func GetAvailableRooms(requestAvailableRooms RequestAvailableRoom) ([]Room, error) {
	var hotelIDs []primitive.ObjectID
	hotelIDs = append(hotelIDs, requestAvailableRooms.HotelID)
	filter := bson.M{
		"hotelID": bson.M{
			"$in": hotelIDs,
		},
		"checkIn": bson.M{
			"$gte": time.Now().In(time.FixedZone("UTC+7", +7*60*60)),
		},
	}
	cursor, err := roomCollection.Find(*database.Ctx, bson.M{"hotelID": requestAvailableRooms.HotelID, "numberOfBed": bson.M{"$gte": requestAvailableRooms.MaxGuest}})
	if err != nil {
		return nil, errors.New("error while getting room")
	}

	availableRooms := make(map[string]Room)
	for cursor.Next(*database.Ctx) {
		var room Room
		if err := cursor.Decode(&room); err != nil {
			return nil, err
		}
		availableRooms[cursor.Current.Lookup("_id").ObjectID().Hex()] = room
	}

	roomOrders, err := roomOrderCollection.Find(*database.Ctx, filter)
	if err != nil {
		return nil, errors.New("error while getting room")
	}
	for roomOrders.Next(*database.Ctx) {
		var roomOrder RoomOrder
		if err := roomOrders.Decode(&roomOrder); err != nil {
			return nil, err
		}

		// If there is a room order that is covered in the checkin checkout time range
		cover := requestAvailableRooms.From.Time().Before(roomOrder.CheckIn.Time()) && requestAvailableRooms.To.Time().After(roomOrder.CheckOut.Time())

		// If check in time is between the room order check in and check out time
		unavailableCheckin := requestAvailableRooms.From.Time().After(roomOrder.CheckIn.Time()) && requestAvailableRooms.From.Time().Before(roomOrder.CheckOut.Time())

		// If check out time is between the room order check in and check out time
		unavailableCheckout := requestAvailableRooms.To.Time().After(roomOrder.CheckIn.Time()) && requestAvailableRooms.To.Time().Before(roomOrder.CheckOut.Time())

		if cover || unavailableCheckin || unavailableCheckout {
			for _, roomID := range roomOrder.RoomIDs {
				delete(availableRooms, roomID.Hex())
			}
		}
	}
	var result []Room
	for _, room := range availableRooms {
		result = append(result, room)
	}
	return result, nil
}

func GetAvailableHotelsByFilter(searchAddress string, checkin string, checkout string, maxGuest uint8, filter Filter) ([]Hotel, error) {
	hotels, err := GetAvailableHotels(searchAddress, checkin, checkout, maxGuest)
	if err != nil {
		return nil, err
	}
	var hotelIDs []primitive.ObjectID
	for _, hotel := range hotels {
		hotelIDs = append(hotelIDs, hotel.ID)
	}

	hotelFilter := bson.M{
		"_id": bson.M{
			"$in": hotelIDs,
		},
	}
	roomFilter := bson.M{
		"hotelID": bson.M{
			"$in": hotelIDs,
		},
	}
	// validate filter
	if filter.BottomPrice != 0 && filter.PeakPrice != 0 {
		tmpFilter := bson.M{
			"minRoomPrice": bson.M{
				"$gte": filter.BottomPrice,
				"$lte": filter.PeakPrice,
			},
		}
		for k, v := range tmpFilter {
			hotelFilter[k] = v
		}
	}
	if filter.StarHotel != 0 {
		tmpFilter := bson.M{
			"star": filter.StarHotel,
		}
		for k, v := range tmpFilter {
			hotelFilter[k] = v
		}
	}
	if filter.StarRating != 0 {
		tmpFilter := bson.M{
			"rank": filter.StarRating,
		}
		for k, v := range tmpFilter {
			hotelFilter[k] = v
		}
	}
	// PaymentOption = 0 -> pay with money
	// PaymentOption = 1 -> need to contact
	if filter.PaymentOption == 0 {
		tmpFilter := bson.M{
			"needToContact": false,
		}
		for k, v := range tmpFilter {
			hotelFilter[k] = v
		}
	} else if filter.PaymentOption == 1 {
		tmpFilter := bson.M{
			"needToContact": true,
		}
		for k, v := range tmpFilter {
			hotelFilter[k] = v
		}
	}
	if filter.NumberOfBed > 0 {
		tmpFilter := bson.M{
			"numberOfBed": filter.NumberOfBed,
		}
		for k, v := range tmpFilter {
			roomFilter[k] = v
		}
	}
	if len(filter.Amenities) > 0 {
		tmpFilter := bson.M{
			"amenities": bson.M{
				"$in": filter.Amenities,
			},
		}
		for k, v := range tmpFilter {
			hotelFilter[k] = v
		}
	}

	// get final list of hotels by intersect filter result
	var result []Hotel
	var refineHotels []Hotel
	var refineRooms []Room
	roomCursor, err := roomCollection.Find(*database.Ctx, roomFilter)
	if err != nil {
		return nil, err
	}
	if err := roomCursor.All(*database.Ctx, &refineRooms); err != nil {
		return nil, err
	}
	hotelCursor, err := hotelCollection.Find(*database.Ctx, hotelFilter)
	if err != nil {
		return nil, err
	}
	if err := hotelCursor.All(*database.Ctx, &refineHotels); err != nil {
		return nil, err
	}

	var newHotelIDs []primitive.ObjectID
	for _, room := range refineRooms {
		newHotelIDs = append(newHotelIDs, room.HotelID)
	}

	var hotelsFromRefineRooms []Hotel
	cursor, err := hotelCollection.Find(*database.Ctx, bson.M{"_id": bson.M{"$in": newHotelIDs}})
	if err != nil {
		return nil, err
	}
	if err := cursor.All(*database.Ctx, &hotelsFromRefineRooms); err != nil {
		return nil, err
	}

	// get intersection of refineHotels and hotelsFromRefineRooms slice
	// create a map to store the elements of refineHotels slice
	m := make(map[string]bool)
	for _, hotel := range refineHotels {
		m[hotel.ID.Hex()] = true
	}
	// iterate over hotelsFromRefineRooms slice and add common element to the final result
	for _, hotel := range hotelsFromRefineRooms {
		if m[hotel.ID.Hex()] {
			result = append(result, hotel)
		}
	}

	return result, nil
}
