package models

import (
	"errors"
	"trebooking/database"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var amenityCollection = database.Database.Collection("Amenity")

type Amenity struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Description string             `bson:"description" json:"description"`
	Icon        string             `bson:"icon" json:"icon"`
}

func GetAllAmenity() ([]Amenity, error) {
	var amenities []Amenity
	filter := bson.D{}
	resultCursor, err := amenityCollection.Find(*database.Ctx, filter)

	if err != nil {
		return nil, err
	}

	if err := resultCursor.All(*database.Ctx, &amenities); err != nil {
		return nil, err
	}

	return amenities, nil
}

func GetAccommodationAmenities(id string, accommodationType string) ([]Amenity, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	if accommodationType == "hotel" {
		var hotel Hotel
		resultCursor := hotelCollection.FindOne(*database.Ctx, bson.M{"_id": objectId})
		if err = resultCursor.Decode(&hotel); err != nil {
			return nil, err
		}

		return hotel.Amenities, nil
	} else if accommodationType == "villa" {
		var villa VillaTownhouse
		resultCursor := villaTownhouseCollection.FindOne(*database.Ctx, bson.M{"_id": objectId, "type": 1})
		if err = resultCursor.Decode(&villa); err != nil {
			return nil, err
		}

		return villa.Amenities, nil
	} else if accommodationType == "townhouse" {
		var townhouse VillaTownhouse
		resultCursor := villaTownhouseCollection.FindOne(*database.Ctx, bson.M{"_id": objectId, "type": 2})
		if err = resultCursor.Decode(&townhouse); err != nil {
			return nil, err
		}

		return townhouse.Amenities, nil
	}

	return nil, errors.New("invalid accommodation type")
}

func AddAmenity(amenity Amenity) (Amenity, error) {
	amenityId, err := amenityCollection.InsertOne(*database.Ctx, amenity)
	objAmenityId := amenityId.InsertedID.(primitive.ObjectID)
	amenity.ID = objAmenityId

	if err != nil {
		return amenity, errors.New("cannot insert amenity")
	}

	return amenity, nil
}

func DeleteAmenity(objId primitive.ObjectID) error {
	var amenity Amenity
	amenityResult := amenityCollection.FindOne(*database.Ctx, bson.M{"_id": objId})
	if err := amenityResult.Decode(&amenity); err != nil {
		return errors.New("no amenity with this id")
	}

	_, err := amenityCollection.DeleteOne(*database.Ctx, bson.M{"_id": objId})
	if err != nil {
		return err
	}

	return nil
}

func DeleteAccommodationAmenity(id string, accommodationType string, amenity Amenity) error {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	if accommodationType == "hotel" {
		updatedResult, err := hotelCollection.UpdateOne(*database.Ctx, bson.M{"_id": objectId}, bson.M{"$pull": bson.M{"amenities": amenity}})
		if err != nil {
			return err
		}
		if updatedResult.MatchedCount == 0 {
			return errors.New("update failed")
		}
	} else if accommodationType == "villa" {
		updatedResult, err := villaTownhouseCollection.UpdateOne(*database.Ctx, bson.M{"_id": objectId, "type": 1}, bson.M{"$pull": bson.M{"amenities": amenity}})
		if err != nil {
			return err
		}
		if updatedResult.MatchedCount == 0 {
			return errors.New("update failed")
		}
	} else if accommodationType == "townhouse" {
		updatedResult, err := villaTownhouseCollection.UpdateOne(*database.Ctx, bson.M{"_id": objectId, "type": 2}, bson.M{"$pull": bson.M{"amenities": amenity}})
		if err != nil {
			return err
		}
		if updatedResult.MatchedCount == 0 {
			return errors.New("update failed")
		}
	}

	return nil
}

func UpdateAmenity(id primitive.ObjectID, amenity Amenity) error {
	filter := bson.M{"_id": id}
	update := bson.M{"$set": amenity}
	updatedAmenity, err := amenityCollection.UpdateOne(*database.Ctx, filter, update)
	if err != nil {
		return err
	}
	if updatedAmenity.MatchedCount == 0 {
		return errors.New("no amenity updated")
	}

	return nil
}

func AddAccommodationAmenity(id string, accommodationType string, amenity Amenity) error {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	if accommodationType == "hotel" {
		updatedResult, err := hotelCollection.UpdateOne(*database.Ctx, bson.M{"_id": objectId}, bson.M{"$push": bson.M{"amenities": amenity}})
		if err != nil {
			return err
		}
		if updatedResult.MatchedCount == 0 {
			return errors.New("update failed")
		}
	} else if accommodationType == "villa" {
		updatedResult, err := villaTownhouseCollection.UpdateOne(*database.Ctx, bson.M{"_id": objectId, "type": 1}, bson.M{"$push": bson.M{"amenities": amenity}})
		if err != nil {
			return err
		}
		if updatedResult.MatchedCount == 0 {
			return errors.New("update failed")
		}
	} else if accommodationType == "townhouse" {
		updatedResult, err := villaTownhouseCollection.UpdateOne(*database.Ctx, bson.M{"_id": objectId, "type": 2}, bson.M{"$push": bson.M{"amenities": amenity}})
		if err != nil {
			return err
		}
		if updatedResult.MatchedCount == 0 {
			return errors.New("update failed")
		}
	}

	return nil
}

// func AddRoomAmenities(id string, amenities []Amenity) error {
// 	roomID, _ := primitive.ObjectIDFromHex(id)
// 	_, err := hotelCollection.UpdateOne(*database.Ctx, bson.M{"_id": roomID}, bson.M{"$push": bson.M{"amenities": bson.M{"$each": amenities}}})
// 	if err != nil {
// 		return err
// 	}
// 	return nil
// }
