package models

import (
	"errors"
	"trebooking/database"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Contact struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	Facebook    string             `bson:"facebook"`
	Gmail       string             `bson:"email"`
	PhoneNumber string             `bson:"phonenumber"`
	Address     string             `bson:"address"`
	Youtube     string             `bson:"youtube"`
	Instagram   string             `bson:"instagram"`
}

var contactCollection = database.Database.Collection("Contact")

func CreateContact(contact *Contact) (*Contact, error) {
	result, err := contactCollection.InsertOne(*database.Ctx, contact)
	if err != nil {
		return nil, errors.New("Create failed")
	}
	insertedId := result.InsertedID.(primitive.ObjectID)
	contact.ID = insertedId
	return contact, err
}

func GetContact() (*Contact, error) {
	var contact *Contact
	result := contactCollection.FindOne(*database.Ctx, bson.M{})
	if err := result.Decode(&contact); err != nil {
		return nil, err
	}
	return contact, nil
}

func UpdateContact(contact *Contact) (*Contact, error) {
	result, err := contactCollection.UpdateByID(*database.Ctx, contact.ID, contact)
	if err != nil {
		return nil, err
	}
	if result.ModifiedCount == 0 {
		return nil, errors.New("Update failed!")
	}
	return contact, err
}
