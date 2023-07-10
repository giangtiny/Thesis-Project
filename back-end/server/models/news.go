package models

import (
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"mime/multipart"
	"sort"
	"trebooking/database"
	"trebooking/services/fileio"
)

var newsCollection = database.Database.Collection("News")

type NewsResponse struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Title     string             `bson:"title" json:"title"`
	Thumbnail string             `bson:"thumbnail" json:"thumbnail"`
	Time      primitive.DateTime `bson:"time" json:"time"`
	Tag       string             `bson:"tag" json:"tag"`
	Content   []NewsContent      `bson:"content" json:"content"`
}

type News struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Title     string             `bson:"title" json:"title"`
	Thumbnail string             `bson:"thumbnail" json:"thumbnail"`
	Time      primitive.DateTime `bson:"time" json:"time"`
	Tag       string             `bson:"tag" json:"tag"`
}

func CreateNews(news News) (News, error) {
	newsID, err := newsCollection.InsertOne(*database.Ctx, news)
	objHotelID := newsID.InsertedID.(primitive.ObjectID)
	news.ID = objHotelID
	return news, err
}

func GetPagedNews(offSet int64, maxPerPage int64) ([]News, error) {
	filter := bson.D{}
	opts := options.Find().SetSkip(offSet).SetLimit(maxPerPage)
	cursor, err := newsCollection.Find(*database.Ctx, filter, opts)
	if err != nil {
		return nil, errors.New("error while getting news")
	}
	var newsList []News
	for cursor.Next(*database.Ctx) {
		var news News
		cursor.Decode(&news)
		newsList = append(newsList, news)

	}
	// Sort the newsList
	sort.Slice(newsList, func(i, j int) bool {
		return newsList[i].Time > newsList[j].Time
	})
	return newsList, nil
}

func UpdateNews(id primitive.ObjectID, news News) error {
	filter := bson.M{"_id": id}
	update := bson.M{"$set": news}
	_, err := newsCollection.UpdateOne(*database.Ctx, filter, update)
	if err != nil {
		return err
	}
	return nil
}

func GetNewsByID(newsID primitive.ObjectID) (NewsResponse, error) {
	var newsResponse NewsResponse
	err := newsCollection.FindOne(*database.Ctx, bson.M{"_id": newsID}).Decode(&newsResponse)
	if err != nil {
		return newsResponse, errors.New("no news with this id")
	}
	newsContent, err := GetNewsContentByNewsID(newsID)
	if err != nil {
		return newsResponse, errors.New("no news content with this news id")
	}
	newsResponse.Content = newsContent
	return newsResponse, nil
}

func GetNews(newsID primitive.ObjectID) (News, error) {
	var news News
	err := newsCollection.FindOne(*database.Ctx, bson.M{"_id": newsID}).Decode(&news)
	if err != nil {
		return news, errors.New("no news with this id")
	}
	return news, nil
}

func GetAllNews() ([]NewsResponse, error) {
	var newsList []NewsResponse
	filter := bson.D{}
	resultCursor, err := newsCollection.Find(*database.Ctx, filter)
	if err != nil {
		return nil, err
	}
	if err := resultCursor.All(*database.Ctx, &newsList); err != nil {
		return nil, err
	}
	// Sort the newsList
	sort.Slice(newsList, func(i, j int) bool {
		return newsList[i].Time > newsList[j].Time
	})
	return newsList, err
}

func DeleteNews(id string) error {
	objID, _ := primitive.ObjectIDFromHex(id)
	var news News
	newsResult := newsCollection.FindOne(*database.Ctx, bson.M{"_id": objID})
	if err := newsResult.Decode(&news); err != nil {
		return errors.New("no news with this id")
	}
	fileio.RemoveImage(news.Thumbnail)
	_, err := newsCollection.DeleteOne(*database.Ctx, bson.M{"_id": objID})
	if err != nil {
		return errors.New("error while deleting news")
	}
	return nil
}

func AddThumbnailsNews(id string, fileUploads []*multipart.FileHeader, field string) error {
	var images []string
	for _, fileUpload := range fileUploads {
		images = append(images, fileUpload.Filename)
	}
	objID, _ := primitive.ObjectIDFromHex(id)
	_, err := newsCollection.UpdateOne(*database.Ctx, bson.M{"_id": objID}, bson.M{"$set": bson.M{field: images[0]}})
	if err != nil {
		return err
	}
	return nil
}

func RemoveThumbnailsNews(id string, imageName []string, field string) error {
	objID, _ := primitive.ObjectIDFromHex(id)
	_, err := newsCollection.UpdateOne(*database.Ctx, bson.M{"_id": objID}, bson.M{"$unset": bson.M{field: imageName[0]}})
	if err != nil {
		return err
	}
	return nil
}

func RemoveThumbnailNews(id string, imageName string, field string) error {
	objID, _ := primitive.ObjectIDFromHex(id)
	_, err := newsCollection.UpdateOne(*database.Ctx, bson.M{"_id": objID}, bson.M{"$unset": bson.M{field: imageName}})
	if err != nil {
		return err
	}
	return nil
}
