package models

import (
	"errors"
	"math"
	"time"
	"trebooking/database"
	"trebooking/utils"

	"go.mongodb.org/mongo-driver/mongo"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type VillaTownhouseOrder struct {
	Order               `bson:",inline"`
	VillaID             primitive.ObjectID `bson:"villaID,omitempty" json:"villaID,omitempty"`
	TownhouseID         primitive.ObjectID `bson:"townhouseID,omitempty" json:"townhouseID,omitempty"`
	UserID              primitive.ObjectID `bson:"userID,omitempty" json:"userID,omitempty"`
	Surcharges          []Surcharges       `bson:"surcharges" json:"surcharges"`
	VillaTownhousePrice float32            `bson:"villaTownhousePrice" json:"villaTownhousePrice"` //Price of villa and townhouse
	TotalPrice          float32            `bson:"totalPrice, omitempty" json:"totalPrice"`        //Total price of order after all fees
	Remain              float32            `bson:"remain, omitempty" json:"remain"`
	OrderType           uint8              `bson:"orderType, omitempty" json:"orderType"` //Type of order
}

type Surcharges struct {
	Name     string  `bson:"name" json:"name"`
	Quantity int64   `bson:"quantity" json:"quantity"`
	Price    float64 `bson:"price, omitempty" json:"price"`
}

var VillaTownhouseOrderCollection = database.Database.Collection("VillaTownhouseOrder")

func CreateVillaOrder(villaOrder VillaTownhouseOrder, prp PaymentResponsePayload) (VillaTownhouseOrder, error) {
	//if villaOrder.UserID != primitive.NilObjectID {
	//	if count, err := accountCollection.CountDocuments(*database.Ctx, bson.M{"_id": villaOrder.UserID}); err != nil {
	//		return villaOrder, err
	//	} else if count == 0 {
	//		return villaOrder, errors.New("UserId is invalid")
	//	}
	//}
	if count, err := villaTownhouseCollection.CountDocuments(*database.Ctx, bson.M{"_id": villaOrder.VillaID}); err != nil {
		return villaOrder, err
	} else if count == 0 {
		return villaOrder, errors.New("VillaId is invalid")
	}
	checkin := villaOrder.CheckIn
	checkout := villaOrder.CheckOut
	filter := bson.M{
		"villaID": villaOrder.VillaID,
		"$or": []interface{}{
			bson.M{
				"checkOut": bson.M{
					"$gte": checkin,
				},
				"checkIn": bson.M{
					"$lte": checkin,
				},
			},
			bson.M{
				"checkOut": bson.M{
					"$gte": checkout,
				},
				"checkIn": bson.M{
					"$lte": checkout,
				},
			},
		},
	}
	countVilla, err := VillaTownhouseOrderCollection.CountDocuments(*database.Ctx, filter)
	if err != nil {
		return villaOrder, err
	}
	if countVilla > 0 {
		return villaOrder, errors.New("Not avaiable at this time")
	}
	//Calculate price for villa order
	villaOrder.PaidDeposit = prp.Amount
	villaOrder, err = SetPriceOfVillaOrder(villaOrder)
	if err != nil {
		return villaOrder, err
	}

	//check surcharges of villa null or not
	//if len(villaOrder.Surcharges) == 0 {
	//	return nil, errors.New("no surcharges in this villa")
	//}

	insertResult, err := VillaTownhouseOrderCollection.InsertOne(*database.Ctx, villaOrder)
	if err != nil {
		return villaOrder, err
	}
	villaOrder.ID = insertResult.InsertedID.(primitive.ObjectID)
	villaOrder.OrderType = utils.VILLA
	//update avaiable field of villa
	UpdateAvailableVillaTownhouse(villaOrder.VillaID)
	return villaOrder, nil
}

func CalculatePriceVillaOrder(villaOrder VillaTownhouseOrder) (VillaTownhouseOrder, error) {
	//if villaOrder.UserID != primitive.NilObjectID {
	//	if count, err := accountCollection.CountDocuments(*database.Ctx, bson.M{"_id": villaOrder.UserID}); err != nil {
	//		return villaOrder, err
	//	} else if count == 0 {
	//		return villaOrder, errors.New("UserId is invalid")
	//	}
	//}
	if count, err := villaTownhouseCollection.CountDocuments(*database.Ctx, bson.M{"_id": villaOrder.VillaID}); err != nil {
		return villaOrder, err
	} else if count == 0 {
		return villaOrder, errors.New("VillaId is invalid")
	}
	checkin := villaOrder.CheckIn
	checkout := villaOrder.CheckOut
	filter := bson.M{
		"villaID": villaOrder.VillaID,
		"$or": []interface{}{
			bson.M{
				"checkOut": bson.M{
					"$gte": checkin,
				},
				"checkIn": bson.M{
					"$lte": checkin,
				},
			},
			bson.M{
				"checkOut": bson.M{
					"$gte": checkout,
				},
				"checkIn": bson.M{
					"$lte": checkout,
				},
			},
		},
	}
	countVilla, err := VillaTownhouseOrderCollection.CountDocuments(*database.Ctx, filter)
	if err != nil {
		return villaOrder, err
	}
	if countVilla > 0 {
		return villaOrder, errors.New("Not avaiable at this time")
	}
	//Calculate price for villa order
	villaOrder, err = SetPriceOfVillaOrder(villaOrder)
	if err != nil {
		return villaOrder, err
	}
	//check surcharges of villa null or not
	//if len(villaOrder.Surcharges) == 0 {
	//	return nil, errors.New("no surcharges in this villa")
	//}
	villaOrder.OrderType = utils.VILLA
	return villaOrder, nil
}

// GetAllVillaOrder
// All order
func GetAllVillaOrder(orderType uint8) ([]VillaTownhouseOrder, error) {
	filter := bson.M{"orderType": orderType}
	return getVillaOrders(filter)
}

// GetAllVillaOrderOfVillaUser
// All order of villa, user
func GetAllVillaOrderOfVillaUser(villaId string, userId string) ([]VillaTownhouseOrder, error) {
	villaObjectId, err := primitive.ObjectIDFromHex(villaId)
	if err != nil {
		return []VillaTownhouseOrder{}, errors.New("VillaId is invalid")
	}
	userObjectId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return []VillaTownhouseOrder{}, errors.New("UserId is invalid")
	}
	filter := bson.M{"villaID": villaObjectId, "userID": userObjectId}
	return getVillaOrders(filter)
}

// GetAllVillaOrderOfVilla
// All order of villa
func GetAllVillaOrderOfVilla(villaId string) ([]VillaTownhouseOrder, error) {
	villaObjectId, err := primitive.ObjectIDFromHex(villaId)
	if err != nil {
		return []VillaTownhouseOrder{}, errors.New("VillaId is invalid")
	}
	filter := bson.M{"villaID": villaObjectId}
	return getVillaOrders(filter)
}

// GetAllVillaOrderOfUser
// All order of user
func GetAllVillaOrderOfUser(userId string) ([]VillaTownhouseOrder, error) {
	userObjectId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return []VillaTownhouseOrder{}, errors.New("UserId is invalid")
	}
	filter := bson.M{"userID": userObjectId}
	return getVillaOrders(filter)
}

// GetVillaOrderByOrderID
// Get order by order id
func GetVillaOrderByOrderID(orderID primitive.ObjectID) (interface{}, error) {
	filter := bson.M{"_id": orderID}
	var villaOrder VillaTownhouseOrder
	if err := VillaTownhouseOrderCollection.FindOne(*database.Ctx, filter).Decode(&villaOrder); err != nil {
		return nil, err
	}
	//return villaOrder, errors.New("No order with this id")
	return villaOrder, nil
}

func UpdateVillaOrder(orderID primitive.ObjectID, villaOrder VillaTownhouseOrder) error {
	oldOrder, err := GetVillaOrderByOrderID(orderID)
	if err != nil {
		return err
	}
	var updatedOrder VillaTownhouseOrder
	if err := VillaTownhouseOrderCollection.FindOneAndUpdate(*database.Ctx, bson.M{"_id": orderID}, bson.M{
		"$set": villaOrder,
	}, options.FindOneAndUpdate().SetReturnDocument(options.After)).Decode(&updatedOrder); err != nil {
		return err
	}
	//if IsOverlapVilla(updatedOrder, true) {
	//	VillaTownhouseOrderCollection.UpdateOne(*database.Ctx, bson.M{"_id": orderID}, bson.M{
	//		"$set": oldOrder,
	//	})
	//	return errors.New("Not available at this time, can not update")
	//}
	VillaTownhouseOrderCollection.UpdateOne(*database.Ctx, bson.M{"_id": orderID}, bson.M{
		"$set": oldOrder,
	})
	updatedOrder.OrderType = utils.VILLA
	updatedOrder, err = SetPriceOfVillaOrder(updatedOrder)
	if err != nil {
		return err
	}
	filter := bson.M{"_id": orderID}
	update := bson.M{
		"$set": updatedOrder,
	}
	result, err := VillaTownhouseOrderCollection.UpdateOne(*database.Ctx, filter, update)
	if err != nil {
		return err
	}
	if result.ModifiedCount == 0 {
		return errors.New("no document modified")
	}
	return nil
}

func DeleteVillaOrder(orderId primitive.ObjectID) error {
	filter := bson.M{"_id": orderId}
	//Update available to villa
	var villaOrder *VillaTownhouseOrder
	result := VillaTownhouseOrderCollection.FindOne(*database.Ctx, filter)
	err := result.Decode(&villaOrder)
	if err != nil {
		return err
	}
	UpdateUnavailableVillaTownhouse(villaOrder.VillaID)
	//delete villa order
	deleteResult, err := VillaTownhouseOrderCollection.DeleteOne(*database.Ctx, filter)
	if err != nil {
		return err
	} else {
		if deleteResult.DeletedCount == 0 {
			return errors.New("villa order not found")
		}
		return nil
	}
}

func getVillaOrders(filter interface{}, ops ...*options.FindOptions) ([]VillaTownhouseOrder, error) {
	var villas []VillaTownhouseOrder
	result, err := VillaTownhouseOrderCollection.Find(*database.Ctx, filter, ops...)
	if err != nil {
		return []VillaTownhouseOrder{}, err
	}
	if err := result.All(*database.Ctx, &villas); err != nil {
		return []VillaTownhouseOrder{}, err
	}
	return villas, nil
}

func GetCurrentUserByVillaID(villaID string) (*VillaTownhouseOrder, error) {
	villaObjID, _ := primitive.ObjectIDFromHex(villaID)
	// currentTime := primitive.NewDateTimeFromTime(time.Now().In(time.FixedZone("UTC+7", +7*60*60)))
	currentTime := time.Now().In(time.FixedZone("UTC+7", +7*60*60))
	filter := bson.M{
		"villaID": villaObjID,
		"checkIn": bson.M{
			"$lte": currentTime.Add(14 * time.Hour),
		},
		"checkOut": bson.M{
			"$gte": currentTime.Add(-12 * time.Hour),
		},
	}
	var order *VillaTownhouseOrder
	result := VillaTownhouseOrderCollection.FindOne(*database.Ctx, filter)
	if err := result.Decode(&order); err != nil {
		return nil, err
	}
	return order, nil
}

func SetPriceOfVillaOrder(villaOrder VillaTownhouseOrder) (VillaTownhouseOrder, error) {
	sum, err := CalculateVillaDeposit(&villaOrder)
	if err != nil {
		return villaOrder, err
	}
	villaOrder.MustPayDeposit = sum
	priceBeforeDiscount, err := CalculateTotalVillaPrice(&villaOrder)
	if err != nil {
		return villaOrder, err
	}
	villaOrder.VillaTownhousePrice = priceBeforeDiscount
	totalPrice, err := ApplyDiscountSurChargeAndVATVilla(priceBeforeDiscount, &villaOrder)
	if err != nil {
		return villaOrder, err
	}
	villaOrder.TotalPrice = totalPrice
	villaOrder = CalculateRemainVilla(villaOrder)
	return villaOrder, nil
}

func CalculateVillaDeposit(villaOrder *VillaTownhouseOrder) (float32, error) {
	villa, err := GetVillaTownhouse(villaOrder.VillaID.Hex())
	if err != nil {
		return 0, err
	}
	sum := float32(0)
	totalDay := GetTotalVillaOfVillaOrder(villaOrder)
	checkIn := villaOrder.CheckIn
	for i := 0; i < totalDay; i++ {
		feeAndPromotion, err := GetEventFeeAndPromotionByCheckIn(villaOrder.VillaID, 0, checkIn)
		if err != nil {
			return 0, err
		}
		normalFee, err := GetMonthlyFeeByMonth(GetTime(checkIn, Month), villaOrder.VillaID, VillaFee)
		price := villa.Price * (1 + normalFee.NormalDayFee)
		if err != nil {
			return 0, err
		}
		if feeAndPromotion == nil {
			sum += price * villa.Deposit
		} else {
			sum += price * villa.Deposit * (1 - feeAndPromotion.Promotion)
		}
		checkIn = primitive.NewDateTimeFromTime(checkIn.Time().Add(time.Hour * 24))
	}
	return sum, nil
}

/*
GetTotalVillaOfVillaOrder Get total rent day of user by check-in and check-out time
*/
func GetTotalVillaOfVillaOrder(villaOrder *VillaTownhouseOrder) int {
	interval := villaOrder.CheckOut.Time().Sub(villaOrder.CheckIn.Time())
	totalRentHour := int(math.Floor(interval.Hours())) + 2
	totalDay := totalRentHour / 24
	return totalDay
}

/*
CalculateTotalVillaPrice
Calculate total villa price before apply discount,...
*/
func CalculateTotalVillaPrice(villaOrder *VillaTownhouseOrder) (float32, error) {
	totalDay := GetTotalVillaOfVillaOrder(villaOrder)
	villa, err := GetVillaTownhouse(villaOrder.VillaID.Hex())
	if err != nil {
		return 0, err
	}
	totalPrice := float32(0)

	checkIn := villaOrder.CheckIn
	for i := 0; i < totalDay; i++ {
		fee, err := GetFeeOfOrder(villaOrder.VillaID, VillaFee, checkIn)
		if err != nil {
			return float32(fee), err
		}
		normalFee, err := GetMonthlyFeeByMonth(GetTime(checkIn, Month), villaOrder.VillaID, VillaFee)
		if err != nil {
			return 0, err
		}
		price := villa.Price * (1 + normalFee.NormalDayFee)
		totalPrice += price * float32(1+fee)
		checkIn = primitive.NewDateTimeFromTime(checkIn.Time().Add(time.Hour * 24))
	}
	return totalPrice, nil
}

/*
ApplyDiscountSurChargeAndVATVilla Apply all the discount, vat and surcharge to original price
*/
func ApplyDiscountSurChargeAndVATVilla(price float32, villaOrder *VillaTownhouseOrder) (float32, error) {
	price, err := ApplyDiscountVilla(price, villaOrder)
	price = ApplyVATVilla(price, villaOrder)
	if err != nil {
		return price, err
	}
	price = ApplySurchargeVilla(price, villaOrder)
	return price, nil
}

/*
ApplyVATVilla Apply v.a.t to the price
*/
func ApplyVATVilla(price float32, villaOrder *VillaTownhouseOrder) float32 {
	(*villaOrder).VATInPrice = price * villaOrder.VAT
	return price * (1 + villaOrder.VAT)
}

/*
ApplyDiscountVilla Apply discount to the price, there are 2 types of discount: by % and by cash
*/
func ApplyDiscountVilla(price float32, villaOrder *VillaTownhouseOrder) (float32, error) {
	if villaOrder.TypeOfDiscount == Percentage {
		price = price * (1 - villaOrder.DiscountInPercentage)
	} else if villaOrder.TypeOfDiscount == Cash {
		price = price - villaOrder.DiscountInCash
		if price < 0 {
			return 0, errors.New("discount exceeded the total villav price")
		}
	}
	return price, nil
}

/*
ApplySurchargeVilla Apply surcharge to the price
*/
func ApplySurchargeVilla(price float32, villaOrder *VillaTownhouseOrder) float32 {
	for _, v := range villaOrder.Surcharges {
		price += float32(v.Price) * float32(v.Quantity)
	}
	return price
}

/*
CalculateRemainVilla
Calculate the remains that user have to paid (after deposit)
*/
func CalculateRemainVilla(villaOrder VillaTownhouseOrder) VillaTownhouseOrder {
	if villaOrder.IsFullyPaid {
		villaOrder.Remain = 0
	} else {
		villaOrder.Remain = villaOrder.TotalPrice - villaOrder.PaidDeposit
	}
	return villaOrder
}

func IsOverlapVilla(villaOrder VillaTownhouseOrder, isUpdateBefore bool) bool {
	checkin := villaOrder.CheckIn
	checkout := villaOrder.CheckOut
	filter := bson.M{
		"villaIDs": bson.M{"$in": villaOrder.VillaID},
		"$or": []interface{}{
			bson.M{
				"checkIn": bson.M{
					"$gte": checkin,
				},
				"checkOut": bson.M{
					"$lte": checkout,
				},
			},
			bson.M{
				"checkIn": bson.M{
					"$lte": checkin,
				},
				"checkOut": bson.M{
					"$gte": checkin,
				},
			},
			bson.M{
				"checkIn": bson.M{
					"$lte": checkout,
				},
				"checkOut": bson.M{
					"$gte": checkout,
				},
			},
		},
	}

	//Check if the time user choose for order is overlap with any order
	countOrder, err := VillaTownhouseOrderCollection.CountDocuments(*database.Ctx, filter)
	if err != nil {
		return true
	}

	count := 0
	if isUpdateBefore {
		count = 1
	}
	if int(countOrder) > count {
		return true
	}
	return false
}

func GetStatisticsVillaByDayAndMonth(day uint, month uint, year uint, villaID primitive.ObjectID) ([]bson.M, error) {
	// filter orders by time
	var filterByTime bson.D
	if day == 0 {
		filterByTime = filterByMonth(month, year)
	} else if day != 0 {
		filterByTime = filterByDayAndMonth(day, month, year)
	}
	// filter orders by orderID
	filterByClientOrderID := bson.D{
		{"$match",
			bson.D{
				{"villaID", villaID},
				{"isFullyPaid", true},
			},
		},
	}

	// calculate statistics
	calculateStatistics := bson.D{
		{"$group",
			bson.D{
				{"_id", "$createdBy"},
				{"createdBy", bson.D{{"$first", "$createdBy"}}},
				{"totalPaidDeposit", bson.D{{"$sum", "$paidDeposit"}}},
				{"totalRemain", bson.D{{"$sum", "$remain"}}},
				{"totalRevenue", bson.D{{"$sum", "$villaTownhousePrice"}}},
				{"performance", bson.D{{"$sum", 1}}},
			},
		},
	}

	// sort by createdBy
	sortByCreatedBy := bson.D{{"$sort", bson.D{{"createdBy", -1}}}}

	// get statistics of order hotel
	groupByCreated := bson.D{
		{"$group",
			bson.D{
				{"_id", "$createdBy"},
				{"records",
					bson.D{
						{"$push",
							bson.D{
								{"checkOut", "$checkOut"},
								{"totalPaidDeposit", "$totalPaidDeposit"},
								{"totalRemain", "$totalRemain"},
								{"totalRevenue", "$totalRevenue"},
								{"performance", "$performance"},
								{"createdBy", "$createdBy"},
							},
						},
					},
				},
				{"totalPaidDeposit", bson.D{{"$sum", "$totalPaidDeposit"}}},
				{"totalRevenue", bson.D{{"$sum", "$totalRevenue"}}},
				{"totalRemain", bson.D{{"$sum", "$totalRemain"}}},
				{"performance", bson.D{{"$sum", "$performance"}}},
				{"createdBy", bson.D{{"$first", "$createdBy"}}},
			},
		},
	}

	var statistics []bson.M
	// pass the pipeline to the Aggregate() method
	cursor, err := VillaTownhouseOrderCollection.Aggregate(*database.Ctx, mongo.Pipeline{filterByTime, filterByClientOrderID, calculateStatistics, groupByCreated, sortByCreatedBy})
	if err != nil {
		panic(err)
	}
	if err := cursor.All(*database.Ctx, &statistics); err != nil {
		panic(err)
	}
	if err != nil {
		return nil, err
	}

	var statisticsView []bson.M
	statisticsByClient := bson.M{
		"createdBy":        "client",
		"records":          []interface{}{},
		"totalPaidDeposit": 0,
		"totalRemain":      0,
		"totalRevenue":     0,
		"performance":      0,
	}

	statisticsByAdmin := bson.M{
		"createdBy":        "admin",
		"records":          []interface{}{},
		"totalPaidDeposit": 0,
		"totalRemain":      0,
		"totalRevenue":     0,
		"performance":      0,
	}

	len := len(statistics)
	if len == 0 {
		statisticsView = append(statisticsView, statisticsByClient)
		statisticsView = append(statisticsView, statisticsByAdmin)
	} else if len == 2 {
		statisticsView = statistics
	} else if len == 1 {
		if statistics[0]["createdBy"] == "client" {
			statisticsView = append(statisticsView, statistics[0])
			statisticsView = append(statisticsView, statisticsByAdmin)
		} else if statistics[0]["createdBy"] == "admin" {
			statisticsView = append(statisticsView, statisticsByClient)
			statisticsView = append(statisticsView, statistics[0])
		}
	}

	return statisticsView, nil
}
