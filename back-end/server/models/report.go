package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Report struct {
	ID                 primitive.ObjectID `bson:"_id,omitempty"`
	TotalDeposit       float32            `bson:"totalreport"`
	TotalMoneyEarnMore float32            `bson:"totalmoneyearnmore"`
	TotalPrice         float32            `bson:"totalprice"`
	Productivity       float32            `bson:"productivity"`
}
