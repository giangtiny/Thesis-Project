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

func CreateTownhouseOrder(townhouseOrder VillaTownhouseOrder, prp PaymentResponsePayload) (VillaTownhouseOrder, error) {
	//if TownhouseOrder.UserID != primitive.NilObjectID {
	//	if count, err := accountCollection.CountDocuments(*database.Ctx, bson.M{"_id": TownhouseOrder.UserID}); err != nil {
	//		return TownhouseOrder, err
	//	} else if count == 0 {
	//		return TownhouseOrder, errors.New("UserId is invalid")
	//	}
	//}
	if count, err := villaTownhouseCollection.CountDocuments(*database.Ctx, bson.M{"_id": townhouseOrder.TownhouseID}); err != nil {
		return townhouseOrder, err
	} else if count == 0 {
		return townhouseOrder, errors.New("TownhouseId is invalid")
	}
	checkin := townhouseOrder.CheckIn
	checkout := townhouseOrder.CheckOut
	filter := bson.M{
		"townhouseID": townhouseOrder.TownhouseID,
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
	countTownhouse, err := VillaTownhouseOrderCollection.CountDocuments(*database.Ctx, filter)
	if err != nil {
		return townhouseOrder, err
	}
	if countTownhouse > 0 {
		return townhouseOrder, errors.New("Not avaiable at this time")
	}
	//Calculate price for townhouse order
	townhouseOrder.PaidDeposit = prp.Amount
	townhouseOrder, err = SetPriceOfTownhouseOrder(townhouseOrder)
	if err != nil {
		return townhouseOrder, err
	}

	//check surcharges of townhouse null or not
	//if len(townhouseOrder.Surcharges) == 0 {
	//	return nil, errors.New("no surcharges in this townhouse")
	//}

	insertResult, err := VillaTownhouseOrderCollection.InsertOne(*database.Ctx, townhouseOrder)
	if err != nil {
		return townhouseOrder, err
	}
	townhouseOrder.ID = insertResult.InsertedID.(primitive.ObjectID)
	townhouseOrder.OrderType = utils.TOWN_HOUSE
	//update available field of townhouse
	UpdateAvailableVillaTownhouse(townhouseOrder.TownhouseID)
	return townhouseOrder, nil
}

func CalculatePriceTownhouseOrder(townhouseOrder VillaTownhouseOrder) (VillaTownhouseOrder, error) {
	if count, err := villaTownhouseCollection.CountDocuments(*database.Ctx, bson.M{"_id": townhouseOrder.TownhouseID}); err != nil {
		return townhouseOrder, err
	} else if count == 0 {
		return townhouseOrder, errors.New("TownhouseId is invalid")
	}
	checkin := townhouseOrder.CheckIn
	checkout := townhouseOrder.CheckOut
	filter := bson.M{
		"townhouseID": townhouseOrder.TownhouseID,
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
	countTownhouse, err := VillaTownhouseOrderCollection.CountDocuments(*database.Ctx, filter)
	if err != nil {
		return townhouseOrder, err
	}
	if countTownhouse > 0 {
		return townhouseOrder, errors.New("Not avaiable at this time")
	}
	//Calculate price for townhouse order
	townhouseOrder, err = SetPriceOfTownhouseOrder(townhouseOrder)
	if err != nil {
		return townhouseOrder, err
	}
	//check surcharges of townhouse null or not
	//if len(townhouseOrder.Surcharges) == 0 {
	//	return nil, errors.New("no surcharges in this townhouse")
	//}
	townhouseOrder.OrderType = utils.TOWN_HOUSE
	return townhouseOrder, nil
}

// GetAllTownhouseOrder
// All order
func GetAllTownhouseOrder(orderType uint8) ([]VillaTownhouseOrder, error) {
	filter := bson.M{"orderType": orderType}
	return getTownhouseOrders(filter)
}

// GetAllTownhouseOrderOfTownhouseUser
// All order of townhouse, user
func GetAllTownhouseOrderOfTownhouseUser(townhouseId string, userId string) ([]VillaTownhouseOrder, error) {
	villaObjectId, err := primitive.ObjectIDFromHex(townhouseId)
	if err != nil {
		return []VillaTownhouseOrder{}, errors.New("TownhouseId is invalid")
	}
	userObjectId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return []VillaTownhouseOrder{}, errors.New("UserId is invalid")
	}
	filter := bson.M{"townhouseID": villaObjectId, "userID": userObjectId}
	return getTownhouseOrders(filter)
}

// GetAllTownhouseOrderOfTownhouse
// All order of townhouse
func GetAllTownhouseOrderOfTownhouse(townhouseId string) ([]VillaTownhouseOrder, error) {
	townhouseObjectId, err := primitive.ObjectIDFromHex(townhouseId)
	if err != nil {
		return []VillaTownhouseOrder{}, errors.New("TownhouseId is invalid")
	}
	filter := bson.M{"townhouseID": townhouseObjectId}
	return getTownhouseOrders(filter)
}

// GetAllTownhouseOrderOfUser
// All order of user
func GetAllTownhouseOrderOfUser(userId string) ([]VillaTownhouseOrder, error) {
	userObjectId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return []VillaTownhouseOrder{}, errors.New("UserId is invalid")
	}
	filter := bson.M{"userID": userObjectId}
	return getTownhouseOrders(filter)
}

// GetTownhouseOrderByOrderID
// Get order by order id
func GetTownhouseOrderByOrderID(orderID primitive.ObjectID) (interface{}, error) {
	filter := bson.M{"_id": orderID}
	var townhouseOrder VillaTownhouseOrder
	if err := VillaTownhouseOrderCollection.FindOne(*database.Ctx, filter).Decode(&townhouseOrder); err != nil {
		return nil, err
	}
	//return TownhouseOrder, errors.New("No order with this id")
	return townhouseOrder, nil
}

func UpdateTownhouseOrder(orderID primitive.ObjectID, townhouseOrder VillaTownhouseOrder) error {
	oldOrder, err := GetTownhouseOrderByOrderID(orderID)
	if err != nil {
		return err
	}
	var updatedOrder VillaTownhouseOrder
	if err := VillaTownhouseOrderCollection.FindOneAndUpdate(*database.Ctx, bson.M{"_id": orderID}, bson.M{
		"$set": townhouseOrder,
	}, options.FindOneAndUpdate().SetReturnDocument(options.After)).Decode(&updatedOrder); err != nil {
		return err
	}
	//if IsOverlapTownhouse(updatedOrder, true) {
	//	VillaTownhouseOrderCollection.UpdateOne(*database.Ctx, bson.M{"_id": orderID}, bson.M{
	//		"$set": oldOrder,
	//	})
	//	return errors.New("Not available at this time, can not update")
	//}

	VillaTownhouseOrderCollection.UpdateOne(*database.Ctx, bson.M{"_id": orderID}, bson.M{
		"$set": oldOrder,
	})
	updatedOrder.OrderType = utils.TOWN_HOUSE
	updatedOrder, err = SetPriceOfTownhouseOrder(updatedOrder)
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

func DeleteTownhouseOrder(orderId primitive.ObjectID) error {
	filter := bson.M{"_id": orderId}
	//update avaiable townhouse
	var townhouseOrder *VillaTownhouseOrder
	result := VillaTownhouseOrderCollection.FindOne(*database.Ctx, filter)
	err := result.Decode(&townhouseOrder)
	if err != nil {
		return err
	}
	UpdateUnavailableVillaTownhouse(townhouseOrder.TownhouseID)
	//delete townhouse order
	if deleteResult, err := VillaTownhouseOrderCollection.DeleteOne(*database.Ctx, filter); err != nil {
		return err
	} else {
		if deleteResult.DeletedCount == 0 {
			return errors.New("townhouse order not found")
		}
		return nil
	}
}

func getTownhouseOrders(filter interface{}, ops ...*options.FindOptions) ([]VillaTownhouseOrder, error) {
	var townhouses []VillaTownhouseOrder
	result, err := VillaTownhouseOrderCollection.Find(*database.Ctx, filter, ops...)
	if err != nil {
		return []VillaTownhouseOrder{}, err
	}
	if err := result.All(*database.Ctx, &townhouses); err != nil {
		return []VillaTownhouseOrder{}, err
	}
	return townhouses, nil
}

func GetCurrentUserByTownhouseID(townhouseID string) (*VillaTownhouseOrder, error) {
	townhouseObjID, _ := primitive.ObjectIDFromHex(townhouseID)
	// currentTime := primitive.NewDateTimeFromTime(time.Now().In(time.FixedZone("UTC+7", +7*60*60)))
	currentTime := time.Now().In(time.FixedZone("UTC+7", +7*60*60))
	filter := bson.M{
		"townhouseID": townhouseObjID,
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

func SetPriceOfTownhouseOrder(townhouseOrder VillaTownhouseOrder) (VillaTownhouseOrder, error) {
	sum, err := CalculateTownhouseDeposit(&townhouseOrder)
	if err != nil {
		return townhouseOrder, err
	}
	townhouseOrder.MustPayDeposit = sum
	priceBeforeDiscount, err := CalculateTotalTownhousePrice(&townhouseOrder)
	townhouseOrder.VillaTownhousePrice = priceBeforeDiscount
	totalPrice, err := ApplyDiscountSurChargeAndVATTownhouse(priceBeforeDiscount, &townhouseOrder)
	if err != nil {
		return townhouseOrder, err
	}
	townhouseOrder.TotalPrice = totalPrice
	townhouseOrder = CalculateRemainTownhouse(townhouseOrder)
	return townhouseOrder, nil
}

func CalculateTownhouseDeposit(townhouseOrder *VillaTownhouseOrder) (float32, error) {
	townhouse, err := GetVillaTownhouse(townhouseOrder.TownhouseID.Hex())
	if err != nil {
		return 0, err
	}
	sum := float32(0)
	totalDay := GetTotalTownhouseOfTownhouseOrder(townhouseOrder)
	checkIn := townhouseOrder.CheckIn
	for i := 0; i < totalDay; i++ {
		feeAndPromotion, err := GetEventFeeAndPromotionByCheckIn(townhouseOrder.TownhouseID, 0, checkIn)
		if err != nil {
			return 0, err
		}
		normalFee, err := GetMonthlyFeeByMonth(GetTime(checkIn, Month), townhouseOrder.TownhouseID, TownHouseFee)
		price := townhouse.Price * (1 + normalFee.NormalDayFee)
		if err != nil {
			return 0, err
		}
		if feeAndPromotion == nil {
			sum += price * townhouse.Deposit
		} else {
			sum += price * townhouse.Deposit * (1 - feeAndPromotion.Promotion)
		}
		checkIn = primitive.NewDateTimeFromTime(checkIn.Time().Add(time.Hour * 24))
	}
	return sum, nil
}

/*
GetTotalTownhouseOfTownhouseOrder Get total rent day of user by check-in and check-out time
*/
func GetTotalTownhouseOfTownhouseOrder(townhouseOrder *VillaTownhouseOrder) int {
	interval := townhouseOrder.CheckOut.Time().Sub(townhouseOrder.CheckIn.Time())
	totalRentHour := int(math.Floor(interval.Hours())) + 2
	totalDay := totalRentHour / 24
	return totalDay
}

/*
CalculateTotalTownhousePrice
Calculate total townhouse price before apply discount,...
*/
func CalculateTotalTownhousePrice(townhouseOrder *VillaTownhouseOrder) (float32, error) {
	totalDay := GetTotalTownhouseOfTownhouseOrder(townhouseOrder)
	townhouse, err := GetVillaTownhouse(townhouseOrder.TownhouseID.Hex())
	if err != nil {
		return 0, err
	}
	totalPrice := float32(0)

	checkIn := townhouseOrder.CheckIn
	for i := 0; i < totalDay; i++ {
		fee, err := GetFeeOfOrder(townhouseOrder.TownhouseID, TownHouseFee, checkIn)
		if err != nil {
			return float32(fee), err
		}
		normalFee, err := GetMonthlyFeeByMonth(GetTime(checkIn, Month), townhouseOrder.TownhouseID, TownHouseFee)
		if err != nil {
			return 0, err
		}
		price := townhouse.Price * (1 + normalFee.NormalDayFee)
		totalPrice += price * float32(1+fee)
		checkIn = primitive.NewDateTimeFromTime(checkIn.Time().Add(time.Hour * 24))
	}
	return totalPrice, nil
}

/*
ApplyDiscountSurChargeAndVATTownhouse Apply all the discount, vat and surcharge to original price
*/
func ApplyDiscountSurChargeAndVATTownhouse(price float32, townhouseOrder *VillaTownhouseOrder) (float32, error) {
	price, err := ApplyDiscountTownhouse(price, townhouseOrder)
	price = ApplyVATTownhouse(price, townhouseOrder)
	if err != nil {
		return price, err
	}
	price = ApplySurchargeTownhouse(price, townhouseOrder)
	return price, nil
}

/*
ApplyVATTownhouse Apply v.a.t to the price
*/
func ApplyVATTownhouse(price float32, townhouseOrder *VillaTownhouseOrder) float32 {
	(*townhouseOrder).VATInPrice = price * townhouseOrder.VAT
	return price * (1 + townhouseOrder.VAT)
}

/*
ApplyDiscountTownhouse Apply discount to the price, there are 2 types of discount: by % and by cash
*/
func ApplyDiscountTownhouse(price float32, townhouseOrder *VillaTownhouseOrder) (float32, error) {
	if townhouseOrder.TypeOfDiscount == Percentage {
		price = price * (1 - townhouseOrder.DiscountInPercentage)
	} else if townhouseOrder.TypeOfDiscount == Cash {
		price = price - townhouseOrder.DiscountInCash
		if price < 0 {
			return 0, errors.New("discount exceeded the total townhouse price")
		}
	}
	return price, nil
}

/*
ApplySurchargeTownhouse Apply surcharge to the price
*/
func ApplySurchargeTownhouse(price float32, townhouseOrder *VillaTownhouseOrder) float32 {
	for _, v := range townhouseOrder.Surcharges {
		price += float32(v.Price) * float32(v.Quantity)
	}
	return price
}

/*
CalculateRemainTownhouse
Calculate the remains that user have to paid (after deposit)
*/
func CalculateRemainTownhouse(townhouseOrder VillaTownhouseOrder) VillaTownhouseOrder {
	if townhouseOrder.IsFullyPaid {
		townhouseOrder.Remain = 0
	} else {
		townhouseOrder.Remain = townhouseOrder.TotalPrice - townhouseOrder.PaidDeposit
	}
	return townhouseOrder
}

func IsOverlapTownhouse(townhouseOrder VillaTownhouseOrder, isUpdateBefore bool) bool {
	checkin := townhouseOrder.CheckIn
	checkout := townhouseOrder.CheckOut
	filter := bson.M{
		"townhouseIDs": bson.M{"$in": townhouseOrder.TownhouseID},
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

func GetStatisticsTownhouseByDayAndMonth(day uint, month uint, year uint, townhouseID primitive.ObjectID) ([]bson.M, error) {
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
				{"townhouseID", townhouseID},
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
