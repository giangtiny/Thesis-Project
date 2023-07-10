package database

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Database *mongo.Database
var Ctx *context.Context

func init() {
	//username := "root"
	//password := "c6MV5hvJebRn7KXa"
	//client, err := mongo.NewClient(options.Client().ApplyURI(fmt.Sprintf("mongodb://%s:%s@tbb-db:27017", username, password)))
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://root:c6MV5hvJebRn7KXa@trebaybooking.com:27017/"))

	if err != nil {
		log.Fatal(err)
	}
	ctx := context.TODO()
	Ctx = &ctx
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	Database = client.Database("TreBay")
}
