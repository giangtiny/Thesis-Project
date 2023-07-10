package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type StatisticsDetail struct {
	CheckOut         primitive.DateTime `bson:"checkOut" json:"checkOut"`
	CreatedBy        string             `bson:"createdBy" json:"createdBy"`
	TotalPaidDeposit float64            `bson:"totalPaidDeposit" json:"totalPaidDeposit"`
	TotalRemain      float64            `bson:"totalRemain" json:"totalRemain"`
	TotalRevenue     float64            `bson:"totalRevenue" json:"totalRevenue"`
	Performance      int64              `bson:"performance" json:"performance"`
}

type List struct {
	CreatedBy        string             `bson:"createdBy" json:"createdBy"`
	TotalPaidDeposit float64            `bson:"totalPaidDeposit" json:"totalPaidDeposit"`
	TotalRemain      float64            `bson:"totalRemain" json:"totalRemain"`
	TotalRevenue     float64            `bson:"totalRevenue" json:"totalRevenue"`
	Performance      int64              `bson:"performance" json:"performance"`
	StatisticsDetail []StatisticsDetail `bson:"statisticsDetail" json:"statisticsDetail"`
}
