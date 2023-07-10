package models

import (
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"mime/multipart"
	"trebooking/database"
	"trebooking/services/fileio"
)

var newsContentCollection = database.Database.Collection("NewsContent")

type NewsContent struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	NewsID    primitive.ObjectID `bson:"newsID" json:"newsID"`
	Header    string             `bson:"header" json:"header"`
	Image     string             `bson:"image" json:"image"`
	HighLight string             `bson:"highLight" json:"highLight"`
	Text      string             `bson:"text" json:"text"`
}

func CreateNewsContent(newsContent NewsContent, newsID string) (NewsContent, error) {
	newsObjID, _ := primitive.ObjectIDFromHex(newsID)
	newsContentID, err := newsContentCollection.InsertOne(*database.Ctx, newsContent)
	objID := newsContentID.InsertedID.(primitive.ObjectID)
	newsContent.ID = objID
	newsContent.NewsID = newsObjID
	if err := UpdateNewsContent(objID, newsContent); err != nil {
		return newsContent, err
	}
	return newsContent, err
}

func UpdateNewsContent(id primitive.ObjectID, newsContent NewsContent) error {
	filter := bson.M{"_id": id}
	update := bson.M{"$set": newsContent}
	_, err := newsContentCollection.UpdateOne(*database.Ctx, filter, update)
	if err != nil {
		return err
	}
	return nil
}

func GetNewsContentByNewsID(newsID primitive.ObjectID) ([]NewsContent, error) {
	var newsContentList []NewsContent
	filter := bson.M{"newsID": newsID}
	resultCursor, err := newsContentCollection.Find(*database.Ctx, filter)
	if err != nil {
		return nil, err
	}
	if err := resultCursor.All(*database.Ctx, &newsContentList); err != nil {
		return nil, err
	}
	return newsContentList, err
}

func GetNewsContent(newsContentID primitive.ObjectID) (NewsContent, error) {
	var newsContent NewsContent
	err := newsContentCollection.FindOne(*database.Ctx, bson.M{"_id": newsContentID}).Decode(&newsContent)
	if err != nil {
		return newsContent, errors.New("no news content with this id")
	}
	return newsContent, nil
}

func DeleteNewsContent(id string) error {
	objID, _ := primitive.ObjectIDFromHex(id)
	var newsContent NewsContent
	newsResult := newsContentCollection.FindOne(*database.Ctx, bson.M{"_id": objID})
	if err := newsResult.Decode(&newsContent); err != nil {
		return errors.New("no news content with this id")
	}
	fileio.RemoveImage(newsContent.Image)
	_, err := newsContentCollection.DeleteOne(*database.Ctx, bson.M{"_id": objID})
	if err != nil {
		return errors.New("error while deleting news content")
	}
	return nil
}

func AddImagesNewsContent(id string, fileUploads []*multipart.FileHeader, field string) error {
	var images []string
	for _, fileUpload := range fileUploads {
		images = append(images, fileUpload.Filename)
	}
	objID, _ := primitive.ObjectIDFromHex(id)
	_, err := newsContentCollection.UpdateOne(*database.Ctx, bson.M{"_id": objID}, bson.M{"$set": bson.M{field: images[0]}})
	if err != nil {
		return err
	}
	return nil
}

func RemoveImagesNewsContent(id string, imageName []string, field string) error {
	objID, _ := primitive.ObjectIDFromHex(id)
	_, err := newsCollection.UpdateOne(*database.Ctx, bson.M{"_id": objID}, bson.M{"$unset": bson.M{field: imageName[0]}})
	if err != nil {
		return err
	}
	return nil
}

func RemoveImageNewContent(id string, imageName string, field string) error {
	objID, _ := primitive.ObjectIDFromHex(id)
	_, err := newsCollection.UpdateOne(*database.Ctx, bson.M{"_id": objID}, bson.M{"$unset": bson.M{field: imageName}})
	if err != nil {
		return err
	}
	return nil
}
