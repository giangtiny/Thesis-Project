package models

import (
	"encoding/json"
	"errors"
	"time"
	"trebooking/database"
	"trebooking/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	HourOrder = 0
	DayOrder  = 1
)

const (
	Sunday   = time.Weekday(0)
	Saturday = time.Weekday(6)
	Holiday  = 2
)

type RoomOrder struct {
	Order          `bson:",inline"`
	OrderType      uint                 `bson:"orderType" json:"orderType"`
	HotelID        primitive.ObjectID   `bson:"hotelID,omitempty" json:"hotelID,omitempty"`
	RoomIDs        []primitive.ObjectID `bson:"roomIDs,omitempty" json:"roomIDs,omitempty"`
	UserID         primitive.ObjectID   `bson:"userID,omitempty" json:"userID,omitempty"`
	RoomSurcharges []RoomSurcharge      `bson:"roomSurcharges" json:"roomSurcharges"`
	TotalPrice     float32              `bson:"totalPrice" json:"totalPrice"` //Total price of order after all fees
	Remain         float32              `bson:"remain" json:"remain"`
	RoomPrice      float32              `bson:"roomPrice" json:"roomPrice"` //Price of room before apply fees
}

type HourRoomOrder struct {
	RoomOrder     `bson:",inline"`
	MaxHour       uint               `bson:"maxHour" json:"maxHour"`
	NumHourPassed string             `bson:"numHourPassed" json:"numHourPassed"`
	CurrentTime   primitive.DateTime `bson:"currentTime" json:"currentTime"`
}

type HourFeePolicy struct {
	Fee  float64 `bson:"fee" json:"fee"`
	Hour uint    `bson:"hour" json:"hour"`
}

type DayRoomOrder struct {
	RoomOrder `bson:",inline"`
}

type RoomSurcharge struct {
	Name     string `bson:"name" json:"name"`
	Quantity int64  `bson:"quantity" json:"quantity"`
	Price    int64  `bson:"price" json:"price"`
}

var roomOrderCollection = database.Database.Collection("RoomOrder")

func ValidateRoomOrder(roomOrder RoomOrder) error {

	// If user order room online, need to check if this account exist
	if !roomOrder.UserID.IsZero() {
		if userCount, err := userCollection.CountDocuments(*database.Ctx, bson.M{"_id": roomOrder.UserID}); err != nil {
			return err
		} else if userCount == 0 {
			return errors.New("no user found with this userID")
		}
	}

	// If there are some wrong ids in list, raise error
	roomCount, err := roomCollection.CountDocuments(*database.Ctx, bson.M{
		"hotelID": roomOrder.HotelID,
		"_id":     bson.M{"$in": roomOrder.RoomIDs}},
	)
	if err != nil {
		return err
	}
	if int(roomCount) != len(roomOrder.RoomIDs) {
		return errors.New("there might be some wrong room id in list or this room is not belong to the correct hotel")
	}
	for _, roomID := range roomOrder.RoomIDs {
		room, err := GetRoomByID(roomID)
		if err != nil {
			return err
		}
		if room.Blocked == true && roomOrder.CreatedBy == "client" {
			return errors.New("Room " + room.RoomNo + " has been blocked and can not create by client")
		}
	}

	// If there is already an order at the time user make order, raise error
	if IsOverlap(roomOrder, false) {
		return errors.New("can not order at this time, there are some rooms are not available")
	}

	return nil
}

func IsOverlap(roomOrder RoomOrder, isUpdateBefore bool) bool {
	checkin := roomOrder.CheckIn
	checkout := roomOrder.CheckOut

	filter := bson.M{
		"roomIDs": bson.M{"$in": roomOrder.RoomIDs},
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
	countOrder, err := roomOrderCollection.CountDocuments(*database.Ctx, filter)
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

/*
ApplyVAT Apply v.a.t to the price
*/
func ApplyVAT(price float32, order *RoomOrder) float32 {
	(*order).VATInPrice = price * order.VAT
	return price * (1 + order.VAT)
}

/*
ApplyDiscount Apply discount to the price, there are 2 types of discount: by % and by cash
*/
func ApplyDiscount(price float32, order *RoomOrder) (float32, error) {
	if order.TypeOfDiscount == Percentage {
		price = price * (1 - order.DiscountInPercentage)
	} else if order.TypeOfDiscount == Cash {
		price = price - order.DiscountInCash
		if price < 0 {
			return 0, errors.New("discount exceeded the total room price")
		}
	}
	return price, nil
}

/*
ApplySurcharge Apply surcharge to the price
*/
func ApplySurcharge(price float32, order *RoomOrder) float32 {
	for _, v := range order.RoomSurcharges {
		price += float32(v.Price) * float32(v.Quantity)
	}
	return price
}

/*
ApplyDiscountSurChargeAndVAT Apply all the discount, vat and surcharge to original price
*/
func ApplyDiscountSurChargeAndVAT(price float32, order *RoomOrder) (float32, error) {
	price, err := ApplyDiscount(price, order)
	price = ApplyVAT(price, order)
	if err != nil {
		return price, err
	}
	price = ApplySurcharge(price, order)

	return price, nil
}

/*
CalculateRemain
Calculate the remains that user have to paid (after deposit)
*/
func CalculateRemain(order RoomOrder) RoomOrder {
	if order.IsFullyPaid {
		order.Remain = 0
	} else {
		order.Remain = order.TotalPrice - order.PaidDeposit
	}
	return order
}

/*
SetDepositOfOrder
Set deposit and must-pay deposit of order
*/
func SetDepositOfOrder(paidDeposit float32, mustPayDeposit float32, order RoomOrder) RoomOrder {
	order.MustPayDeposit = paidDeposit
	order.PaidDeposit = mustPayDeposit
	return order
}

// -------------- CRUD room order -------------------------

func GetOrderByOrderID(orderID primitive.ObjectID) (interface{}, error) {
	filter := bson.M{"_id": orderID}

	var order RoomOrder
	if order.OrderType == 0 {
		var hourOrder HourRoomOrder
		if err := roomOrderCollection.FindOne(*database.Ctx, filter).Decode(&hourOrder); err != nil {
			return nil, errors.New("no order with this id")
		}

		return hourOrder, nil
	} else {
		var dayOrder DayRoomOrder
		if err := roomOrderCollection.FindOne(*database.Ctx, filter).Decode(&dayOrder); err != nil {
			return nil, errors.New("no order with this id")
		}

		return dayOrder, nil
	}
}

func GetOrdersByHotelID(hotelID primitive.ObjectID) ([]RoomOrder, error) {
	filter := bson.M{"hotelID": hotelID}
	orders := []RoomOrder{}
	cursor, err := roomOrderCollection.Find(*database.Ctx, filter)
	if err := cursor.All(*database.Ctx, &orders); err != nil {
		return orders, errors.New("invalid hotel id")
	}
	if err != nil {
		return nil, err
	}

	return orders, nil
}

func GetOrdersByUserID(userID primitive.ObjectID) ([]RoomOrder, error) {
	filter := bson.M{"userID": userID}
	orders := []RoomOrder{}
	cursor, err := roomOrderCollection.Find(*database.Ctx, filter)
	if err := cursor.All(*database.Ctx, &orders); err != nil {
		return orders, errors.New("invalid user id")
	}
	if err != nil {
		return nil, err
	}

	return orders, nil
}

func GetOrdersByPhonenumberHotelID(phoneNumber string, hotelID primitive.ObjectID) ([]RoomOrder, error) {
	filter := bson.M{"phoneNumber": phoneNumber, "hotelID": hotelID}
	orders := []RoomOrder{}
	cursor, err := roomOrderCollection.Find(*database.Ctx, filter)
	if err := cursor.All(*database.Ctx, &orders); err != nil {
		return orders, errors.New("invalid user id")
	}
	if err != nil {
		return nil, err
	}

	return orders, nil
}

func GetOrdersByPhoneNumber(phoneNumber string) ([]RoomOrder, error) {
	filter := bson.M{"phoneNumber": phoneNumber}
	orders := []RoomOrder{}
	cursor, err := roomOrderCollection.Find(*database.Ctx, filter)
	if err := cursor.All(*database.Ctx, &orders); err != nil {
		return orders, errors.New("invalid phone number")
	}
	if err != nil {
		return nil, err
	}

	return orders, nil
}

func GetOrderByOwner(ownerID string) ([]RoomOrder, error) {
	objOwnerID, _ := primitive.ObjectIDFromHex(ownerID)
	var hotels []Hotel
	hotelResult, _ := hotelCollection.Find(*database.Ctx, bson.M{
		"ownerID": objOwnerID,
	})
	hotelResult.All(*database.Ctx, &hotels)
	var hotelIDs []primitive.ObjectID
	for _, hotel := range hotels {
		hotelIDs = append(hotelIDs, hotel.ID)
	}

	var orders []RoomOrder
	cursor, err := roomOrderCollection.Find(*database.Ctx, bson.M{
		"hotelID": bson.M{"$in": hotelIDs},
	})
	if err != nil {
		return nil, errors.New("this user has no hotel")
	}
	if err := cursor.All(*database.Ctx, &orders); err != nil {
		return nil, err
	}
	return orders, nil

}

func GetOrdersByRoom(roomID string) ([]RoomOrder, error) {
	roomObjID, _ := primitive.ObjectIDFromHex(roomID)
	arr := make([]primitive.ObjectID, 0)
	arr = append(arr, roomObjID)
	filter := bson.M{"roomIDs": bson.M{"$in": arr}}
	var orders []RoomOrder
	if cursor, err := roomOrderCollection.Find(*database.Ctx, filter); err != nil {
		return nil, err
	} else {
		if err := cursor.All(*database.Ctx, &orders); err != nil {
			return nil, err
		}
		return orders, nil
	}
}

func DeleteRoomOrder(roomID primitive.ObjectID) error {
	filter := bson.M{"_id": roomID}
	if deleteResult, err := roomOrderCollection.DeleteOne(*database.Ctx, filter); err != nil {
		return err
	} else {
		if deleteResult.DeletedCount == 0 {
			return errors.New("room order not found")
		}
		return nil
	}
}

func GetCurrentUserByRoomID(roomID string) (*RoomOrder, error) {
	roomObjID, _ := primitive.ObjectIDFromHex(roomID)
	var arr []primitive.ObjectID
	arr = append(arr, roomObjID)
	currentTime := primitive.NewDateTimeFromTime(time.Now().In(time.FixedZone("UTC+7", +7*60*60)))
	filter := bson.M{
		"roomIDs": bson.M{
			"$all": arr,
		},
		"checkIn": bson.M{
			"$lte": currentTime,
		},
		"$or": []interface{}{
			bson.M{
				"checkOut": bson.M{"$gte": currentTime},
			},
			bson.M{
				"checkOut": bson.M{"$eq": nil},
			},
		},
	}
	var order *RoomOrder
	result := roomOrderCollection.FindOne(*database.Ctx, filter)
	if err := result.Decode(&order); err != nil {
		return nil, err
	}
	return order, nil
}

func ValidateAllFieldOfNewOrder(order RoomOrder) (bool, string) {
	isValid, valErr := utils.ValidateAPI(
		utils.ValidateEmail(order.Gmail),
		utils.ValidatePhone(order.PhoneNumber),
		utils.ValidateCheckInCheckOutTime(order.CheckIn, order.CheckOut),
		utils.ValidateStringEmpty(order.UserName, "UserName"),
		utils.ValidateObjectNil(order.NumberOfCustomer, "NumberOfCustomer"),
	)
	err, _ := json.Marshal(valErr)
	return isValid, string(err)
}

func GetStatisticsHotelByDayAndMonth(day uint, month uint, year uint, hotelID primitive.ObjectID) ([]bson.M, error) {
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
				{"hotelID", hotelID},
				{"isFullyPaid", true},
			},
		},
	}

	// calculate statistics
	calculateStatistics := bson.D{
		{"$group",
			bson.D{
				{"_id", bson.D{
					{"checkOut", "$checkOut"},
					{"createdBy", "$createdBy"},
					{"hotelID", "$hotelID"},
				}},
				{"checkOut", bson.D{{"$first", "$checkOut"}}},
				{"createdBy", bson.D{{"$first", "$createdBy"}}},
				{"totalPaidDeposit", bson.D{{"$sum", "$paidDeposit"}}},
				{"totalRemain", bson.D{{"$sum", "$remain"}}},
				{"totalRevenue", bson.D{{"$sum", "$roomPrice"}}},
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
	// pass the pipeline to the Aggregate() method to set every day of month
	cursor, err := roomOrderCollection.Aggregate(*database.Ctx, mongo.Pipeline{filterByTime, filterByClientOrderID, calculateStatistics, groupByCreated, sortByCreatedBy})
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

func filterByDayAndMonth(day uint, month uint, year uint) bson.D {
	filterDayMonth := bson.D{
		{"$match",
			bson.D{
				{"$expr", bson.D{
					{"$and", bson.A{
						bson.D{{"$eq", bson.A{bson.D{{"$dayOfMonth", "$checkOut"}}, day}}},
						bson.D{{"$eq", bson.A{bson.D{{"$month", "$checkOut"}}, month}}},
						bson.D{{"$eq", bson.A{bson.D{{"$year", "$checkOut"}}, year}}},
					}},
				}},
			},
		},
	}
	return filterDayMonth
}

func filterByMonth(month uint, year uint) bson.D {
	filterMonth := bson.D{
		{"$match",
			bson.D{
				{"$expr", bson.D{
					{"$and", bson.A{
						bson.D{{"$eq", bson.A{bson.D{{"$month", "$checkOut"}}, month}}},
						bson.D{{"$eq", bson.A{bson.D{{"$year", "$checkOut"}}, year}}},
					}},
				}},
			},
		},
	}
	return filterMonth
}
