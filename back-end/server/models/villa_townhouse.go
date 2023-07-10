package models

import (
	"context"
	"errors"
	"time"
	"trebooking/database"

	"mime/multipart"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type VillaTownhouse struct {
	ID                   primitive.ObjectID   `bson:"_id,omitempty" json:"_id,omitempty"`
	OwnerID              primitive.ObjectID   `bson:"ownerID,omitempty" json:"ownerID,omitempty"`
	Name                 string               `bson:"name" json:"name"`
	Address              string               `bson:"address" json:"address"`
	Images               []string             `bson:"images" json:"images"`
	Description          string               `bson:"description" json:"description"`
	Price                float32              `bson:"price" json:"price"`
	SurchargeFee         float32              `bson:"surchargeFee" json:"surchargeFee"`
	Promotion            float32              `bson:"promotion" json:"promotion"`
	Star                 float32              `bson:"star" json:"star"`
	CancelFee            float32              `bson:"cancelFee" json:"cancelFee"`
	Deposit              float32              `bson:"deposit" json:"deposit"`
	Date                 []string             `bson:"date" json:"date"`
	NumberOfCustomer     uint8                `bson:"numberOfCustomer" json:"numberOfCustomer"`
	Type                 uint8                `bson:"type" json:"type"`
	CommentIDs           []primitive.ObjectID `bson:"commentIDs,omitempty" json:"commentIDs,omitempty"`
	PromotionDescription string               `bson:"promotionDescription" json:"promotionDescription"`
	NeedToContact        bool                 `bson:"needToContact" json:"needToContact"`
	ContactInfor         string               `bson:"contactInfor" json:"contactInfor"`
	Available            bool                 `bson:"available" json:"available"`
	Amenities            []Amenity            `bson:"amenities" json:"amenities"`
	Image360             []string             `bson:"images360" json:"images360"`
	Lat                  float32              `bson:"lat" json:"lat"`
	Lng                  float32              `bson:"lng" json:"lng"`
}

var villaTownhouseCollection = database.Database.Collection("VillaTownhouse")

func CreateVillaTownhouse(villaTownhouse *VillaTownhouse) (*VillaTownhouse, error) {
	result, err := villaTownhouseCollection.InsertOne(*database.Ctx, villaTownhouse)
	if err != nil {
		return nil, errors.New("Create failed")
	}
	insertedId := result.InsertedID.(primitive.ObjectID)
	villaTownhouse.ID = insertedId
	villaTownhouse.Available = true
	if err != CreateDayPrices(insertedId, int(villaTownhouse.Type)) {
		return villaTownhouse, err
	}
	if villaTownhouse, err := UpdateVillaTownhouse(villaTownhouse); err != nil {
		return villaTownhouse, err
	}
	return villaTownhouse, err
}

func GetAllVillaTownhouse(t uint8) ([]VillaTownhouse, error) {
	var villaTownhouseList []VillaTownhouse
	resultCursor, err := villaTownhouseCollection.Find(*database.Ctx, bson.M{"type": t})
	if err != nil {
		return nil, err
	}
	if err := resultCursor.All(*database.Ctx, &villaTownhouseList); err != nil {
		return nil, err
	}
	return villaTownhouseList, err
}

func GetPagedVillaTownhouse(t uint8, offset int, maxPerPage int) ([]VillaTownhouse, error) {
	skip := int64(offset * maxPerPage)
	limit := int64(maxPerPage)
	filter := bson.M{"type": t}
	opts := options.FindOptions{
		Skip:  &skip,
		Limit: &limit,
	}
	result, err := villaTownhouseCollection.Find(*database.Ctx, filter, &opts)
	if err != nil {
		return nil, err
	}
	var villaTownhouseList []VillaTownhouse
	if err := result.All(*database.Ctx, &villaTownhouseList); err != nil {
		return nil, err
	}
	return villaTownhouseList, nil
}

func GetVillaTownhouse(id string) (*VillaTownhouse, error) {
	var villaTownhouse *VillaTownhouse
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	result := villaTownhouseCollection.FindOne(*database.Ctx, bson.M{"_id": objectId})
	err = result.Decode(&villaTownhouse)
	if err != nil {
		return nil, err
	}
	return villaTownhouse, err
}

func UpdateVillaTownhouse(villaTownhouse *VillaTownhouse) (*VillaTownhouse, error) {
	filter := bson.M{"_id": villaTownhouse.ID}
	update := bson.M{"$set": villaTownhouse}
	result, err := villaTownhouseCollection.UpdateOne(*database.Ctx, filter, update)
	if err != nil {
		return nil, err
	}
	if result.ModifiedCount == 0 {
		return nil, errors.New("No document updated")
	}
	return villaTownhouse, err
}

func DeleteVillaTownhouse(id string) error {
	objectId, _ := primitive.ObjectIDFromHex(id)
	filter := bson.M{"_id": objectId}
	result, err := villaTownhouseCollection.DeleteOne(*database.Ctx, filter)
	if err != nil {
		return err
	}
	if result.DeletedCount == 0 {
		return errors.New("Delete failed")
	}
	return err
}

func CalculateVillaTownhouseFee(id string, checkIn, checkOut primitive.DateTime) (interface{}, error) {
	villaId, _ := primitive.ObjectIDFromHex(id)
	checkInTime := checkIn.Time()
	checkOutTime := checkOut.Time()
	if checkInTime.Hour() != 14 || checkOutTime.Hour() != 12 {
		return nil, errors.New("Input is invalid!")
	}
	var villaTownhouse VillaTownhouse
	docResult := villaTownhouseCollection.FindOne(*database.Ctx, bson.M{"_id": villaId})
	if err := docResult.Decode(&villaTownhouse); err != nil {
		return nil, err
	}
	checkOutTime = checkOutTime.Add(2 * time.Hour)
	price := villaTownhouse.Price
	duration := checkOutTime.Sub(checkInTime).Hours() / 24
	total := float64(price) * duration
	deposit := float64(total) * float64(villaTownhouse.Deposit) / 100
	return map[string]interface{}{
		"name":     villaTownhouse.Name,
		"price":    price,
		"duration": duration,
		"total":    total,
		"deposit":  deposit,
	}, nil
}

type specialVillaTownhouse struct {
	Name             string
	Address          string
	NumberOfCustomer uint8
	Status           int
}

func GetAllSpecialVillaTownhouse(t uint8) ([]specialVillaTownhouse, error) {
	var allVillaTownhouseResult []specialVillaTownhouse
	var allVillaTownhouse []VillaTownhouse

	villaTownhouseResult, err := villaTownhouseCollection.Find(*database.Ctx, bson.M{"type": t})
	if err != nil {
		return nil, err
	}
	if err := villaTownhouseResult.All(*database.Ctx, &allVillaTownhouse); err != nil {
		return nil, err
	}
	for _, villa := range allVillaTownhouse {
		orderVilla, _ := GetCurrentUserByVillaID(villa.ID.Hex())
		newVillaResult := specialVillaTownhouse{
			Name:             villa.Name,
			Address:          villa.Address,
			NumberOfCustomer: villa.NumberOfCustomer,
			Status:           0}
		if orderVilla != nil {
			newVillaResult.Status = 1
		}
		allVillaTownhouseResult = append(allVillaTownhouseResult, newVillaResult)
	}

	return allVillaTownhouseResult, nil
}

func UpdateAvailableVillaTownhouse(villaTownhouseID primitive.ObjectID) error {
	filter := bson.M{"_id": villaTownhouseID}
	update := bson.D{{"$set", bson.D{{"available", false}}}}
	result, err := villaTownhouseCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}
	if result.ModifiedCount == 0 {
		return errors.New("No document updated")
	}
	return nil
}

func UpdateUnavailableVillaTownhouse(villaTownhouseID primitive.ObjectID) error {
	filter := bson.M{"_id": villaTownhouseID}
	update := bson.D{{"$set", bson.D{{"available", true}}}}
	result, err := villaTownhouseCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}
	if result.ModifiedCount == 0 {
		return errors.New("No document updated")
	}
	return nil
}

func AddImagesVillaTownhouse(id string, fileUploads []*multipart.FileHeader, typeImage string) error {
	var images []string
	for _, fileUpload := range fileUploads {
		images = append(images, fileUpload.Filename)
	}
	villaTownhouseID, _ := primitive.ObjectIDFromHex(id)
	_, err := villaTownhouseCollection.UpdateOne(*database.Ctx, bson.M{"_id": villaTownhouseID}, bson.M{"$push": bson.M{typeImage: bson.M{"$each": images}}})
	if err != nil {
		return err
	}
	return nil
}

func RemoveImagesVillaTownhouse(id string, imageNames []string, typeImage string) error {
	villaTownhouseID, _ := primitive.ObjectIDFromHex(id)
	_, err := villaTownhouseCollection.UpdateOne(*database.Ctx, bson.M{"_id": villaTownhouseID}, bson.M{"$pull": bson.M{typeImage: bson.M{"$in": imageNames}}})
	if err != nil {
		return err
	}
	return nil
}
