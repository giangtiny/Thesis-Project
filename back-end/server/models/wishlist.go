package models

import (
	"errors"
	"trebooking/database"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AddToWishListVillaTownhouseIDs(id string, wishList []string) error {
	accountID, _ := primitive.ObjectIDFromHex(id)
	var wl []primitive.ObjectID
	for _, s := range wishList {
		t, err := primitive.ObjectIDFromHex(s)
		if err != nil {
			return err
		}
		wl = append(wl, t)
	}
	filter := bson.M{"_id": accountID}
	update := bson.M{
		"$addToSet": bson.M{
			"wishListVillaTownhouseIDs": bson.M{
				"$each": wl,
			},
		},
	}
	return updateWishList(filter, update)
}

func AddToWishListHotelIDs(id string, wishList []string) error {
	accountID, _ := primitive.ObjectIDFromHex(id)
	var wl []primitive.ObjectID
	for _, s := range wishList {
		t, err := primitive.ObjectIDFromHex(s)
		if err != nil {
			return err
		}
		wl = append(wl, t)
	}
	filter := bson.M{"_id": accountID}
	update := bson.M{
		"$addToSet": bson.M{
			"wishListHotelIDs": bson.M{
				"$each": wl,
			},
		},
	}
	return updateWishList(filter, update)
}

func DeleteFromWishListVillaTownhouseIDs(id string, wishList []string) error {
	accountID, _ := primitive.ObjectIDFromHex(id)
	var wl []primitive.ObjectID
	for _, s := range wishList {
		t, err := primitive.ObjectIDFromHex(s)
		if err != nil {
			return err
		}
		wl = append(wl, t)
	}
	filter := bson.M{"_id": accountID}
	update := bson.M{
		"$pullAll": bson.M{
			"wishListVillaTownhouseIDs": wl,
		},
	}
	return updateWishList(filter, update)
}

func DeleteFromWishListHotelIDs(id string, wishList []string) error {
	accountID, _ := primitive.ObjectIDFromHex(id)
	var wl []primitive.ObjectID
	for _, s := range wishList {
		t, err := primitive.ObjectIDFromHex(s)
		if err != nil {
			return err
		}
		wl = append(wl, t)
	}
	filter := bson.M{"_id": accountID}
	update := bson.M{
		"$pullAll": bson.M{
			"wishListHotelIDs": wl,
		},
	}
	return updateWishList(filter, update)
}

func updateWishList(filter interface{}, update interface{}) error {
	result, err := accountCollection.UpdateOne(*database.Ctx, filter, update)
	if err != nil {
		return err
	}
	if result.ModifiedCount == 0 {
		return errors.New("No documents updated")
	}
	return nil
}

func GetWishListVillaTownhouse(id primitive.ObjectID) ([]VillaTownhouse, error) {
	var account Account
	var wishListIDs []primitive.ObjectID
	result := accountCollection.FindOne(*database.Ctx, bson.M{"_id": id})
	if err := result.Decode(&account); err != nil {
		return []VillaTownhouse{}, err
	}
	wishListIDs = account.WishListVillaTownhouseIDs
	if wishListIDs == nil {
		wishListIDs = []primitive.ObjectID{}
	}
	wishlist, err := villaTownhouseCollection.Find(*database.Ctx, bson.M{"_id": bson.M{"$in": wishListIDs}})
	if err != nil {
		return []VillaTownhouse{}, err
	}
	var allVilla []VillaTownhouse
	if err := wishlist.All(*database.Ctx, &allVilla); err != nil {
		return []VillaTownhouse{}, err
	}
	if allVilla == nil {
		allVilla = []VillaTownhouse{}
	}
	return allVilla, nil
}

func GetWishListHotel(id primitive.ObjectID) ([]Hotel, error) {
	var account Account
	var wishListIDs []primitive.ObjectID
	result := accountCollection.FindOne(*database.Ctx, bson.M{"_id": id})
	if err := result.Decode(&account); err != nil {
		return []Hotel{}, err
	}
	wishListIDs = account.WishListHotelIDs
	if wishListIDs == nil {
		wishListIDs = []primitive.ObjectID{}
	}
	wishlist, err := hotelCollection.Find(*database.Ctx, bson.M{"_id": bson.M{"$in": wishListIDs}})
	if err != nil {
		return []Hotel{}, err
	}
	var allHotel []Hotel
	if err := wishlist.All(*database.Ctx, &allHotel); err != nil {
		return []Hotel{}, err
	}
	if allHotel == nil {
		allHotel = []Hotel{}
	}
	return allHotel, nil
}
