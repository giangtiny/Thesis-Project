package models

import (
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"trebooking/database"
	"trebooking/utils"
)

type VillaTownhouseInvoiceDetail struct {
	OrderID                        primitive.ObjectID               `bson:"orderID,omitempty" json:"orderID,omitempty"`
	OrderCode                      string                           `bson:"orderCode" json:"orderCode"`
	UserName                       string                           `bson:"userName" json:"userName"`
	Gmail                          string                           `bson:"gmail" json:"gmail"`
	VillaTownhouseInvoiceSurCharge []VillaTownhouseInvoiceSurCharge `bson:"villaTownhouseInvoiceSurCharge" json:"villaTownhouseInvoiceSurCharge"`
	PhoneNumber                    string                           `bson:"phoneNumber" json:"phoneNumber"`
	NameOfVillaTownhouse           string                           `bson:"nameOfVillaTownhouse" json:"nameOfVillaTownhouse"`
	IdOfVillaTownhouse             primitive.ObjectID               `bson:"idOfVillaTownhouse,omitempty" json:"idOfVillaTownhouse,omitempty"`
	Address                        string                           `bson:"address" json:"address"`
	PhoneNumberOfBusiness          string                           `bson:"phoneNumberOfBusiness" json:"phoneNumberOfBusiness"`
	VillaTownhousePrice            float32                          `bson:"villaTownhousePrice" json:"villaTownhousePrice"`
	TotalSurCharge                 float32                          `bson:"totalSurCharge" json:"totalSurCharge"`
	VAT                            float32                          `bson:"vat" json:"vat"` // For VAT invoice
	VATInPrice                     float32                          `bson:"vatInPrice" json:"vatInPrice"`
	TotalPrice                     float32                          `bson:"totalPrice" json:"totalPrice"`
	TotalTime                      int                              `bson:"totalTime" json:"totalTime"` //total rent days
	Discount                       float32                          `bson:"discount" json:"discount"`
	PaidDeposit                    float32                          `bson:"paidDeposit" json:"paidDeposit"`
	MustPayDeposit                 float32                          `bson:"mustPayDeposit" json:"mustPayDeposit"`
	Remain                         float32                          `bson:"remain" json:"remain"`
}

type VillaTownhouseInvoiceSurCharge struct {
	Surcharges     `bson:",inline"`
	TotalSurCharge float32 `bson:"totalSurCharge" json:"totalSurCharge"`
}

func GetVillaTownhouseInvoiceByOrderID(orderID primitive.ObjectID, orderType uint8) (VillaTownhouseInvoiceDetail, error) {
	var villaTownhouseInvoiceDetail VillaTownhouseInvoiceDetail
	var villaTownhouseOrder VillaTownhouseOrder
	var totalTime int

	result := VillaTownhouseOrderCollection.FindOne(*database.Ctx, bson.M{
		"_id":       orderID,
		"orderType": orderType,
	})

	if err := result.Decode(&villaTownhouseOrder); err != nil {
		return villaTownhouseInvoiceDetail, errors.New("no order with this id and this order type")
	}
	totalTime = GetTotalVillaOfVillaOrder(&villaTownhouseOrder)
	return SetVillaTownhouseInvoiceDetail(villaTownhouseInvoiceDetail, totalTime, villaTownhouseOrder)
}

func SetVillaTownhouseInvoiceDetail(villaTownhouseInvoiceDetail VillaTownhouseInvoiceDetail, totalTime int, villaTownhouseOrder VillaTownhouseOrder) (VillaTownhouseInvoiceDetail, error) {
	var villaTownhouseInvoiceSurCharges []VillaTownhouseInvoiceSurCharge
	var rooms []Room
	//var eventFeeAndPromotion *EventFeeAndPromotion
	totalSurCharges := float32(0)
	for _, surcharge := range villaTownhouseOrder.Surcharges {
		var villaTownhouseInvoiceSurCharge VillaTownhouseInvoiceSurCharge
		villaTownhouseInvoiceSurCharge.Surcharges = surcharge
		villaTownhouseInvoiceSurCharge.TotalSurCharge = float32(surcharge.Price) * float32(surcharge.Quantity)
		villaTownhouseInvoiceSurCharges = append(villaTownhouseInvoiceSurCharges, villaTownhouseInvoiceSurCharge)
		totalSurCharges += villaTownhouseInvoiceSurCharge.TotalSurCharge
	}

	cursor, err := VillaTownhouseOrderCollection.Find(*database.Ctx, bson.M{
		"_id": villaTownhouseOrder.ID,
	})
	if err != nil {
		return villaTownhouseInvoiceDetail, err
	}

	if err := cursor.All(*database.Ctx, &rooms); err != nil {
		return villaTownhouseInvoiceDetail, err
	}

	discount := float32(0)
	if villaTownhouseOrder.TypeOfDiscount == Percentage {
		price, _ := CalculateTotalVillaPrice(&villaTownhouseOrder)
		discount = villaTownhouseOrder.DiscountInPercentage * price
	} else {
		discount = villaTownhouseOrder.DiscountInCash
	}

	//if villaTownhouseOrder.OrderType == utils.VILLA {
	//	fee, err := GetFeeOfOrder(villaTownhouseOrder.VillaID, 0, villaTownhouseOrder.CheckIn)
	//	if err != nil {
	//		return villaTownhouseInvoiceDetail, err
	//	}
	//} else if villaTownhouseOrder.OrderType == utils.TOWN_HOUSE {
	//	fee, err := GetFeeOfOrder(villaTownhouseOrder.TownhouseID, 0, villaTownhouseOrder.CheckIn)
	//	if err != nil {
	//		return villaTownhouseInvoiceDetail, err
	//	}
	//}

	//Get promotion
	//if villaTownhouseOrder.OrderType == utils.VILLA {
	//	eventFeeAndPromotion, err = GetEventFeeAndPromotionByCheckIn(villaTownhouseOrder.VillaID, 0, villaTownhouseOrder.CheckIn)
	//	if err != nil {
	//		return villaTownhouseInvoiceDetail, err
	//	}
	//} else if villaTownhouseOrder.OrderType == utils.TOWN_HOUSE {
	//	eventFeeAndPromotion, err = GetEventFeeAndPromotionByCheckIn(villaTownhouseOrder.TownhouseID, 0, villaTownhouseOrder.CheckIn)
	//	if err != nil {
	//		return villaTownhouseInvoiceDetail, err
	//	}
	//}
	//
	//promotion := float32(0)
	//if eventFeeAndPromotion != nil {
	//	promotion = eventFeeAndPromotion.Promotion
	//}

	villaTownhouseInvoiceDetail.OrderID = villaTownhouseOrder.ID
	villaTownhouseInvoiceDetail.OrderCode = "Coming soon"
	villaTownhouseInvoiceDetail.UserName = villaTownhouseOrder.UserName
	villaTownhouseInvoiceDetail.Gmail = villaTownhouseOrder.Gmail
	villaTownhouseInvoiceDetail.PhoneNumber = villaTownhouseOrder.PhoneNumber
	villaTownhouseInvoiceDetail.VillaTownhouseInvoiceSurCharge = villaTownhouseInvoiceSurCharges
	//
	if villaTownhouseOrder.OrderType == utils.VILLA {
		villaTownhouse, err := GetVillaTownhouse(villaTownhouseOrder.VillaID.Hex())
		if err != nil {
			return villaTownhouseInvoiceDetail, err
		}
		villaTownhouseInvoiceDetail.NameOfVillaTownhouse = villaTownhouse.Name
		villaTownhouseInvoiceDetail.IdOfVillaTownhouse = villaTownhouseOrder.VillaID
		villaTownhouseInvoiceDetail.Address = villaTownhouse.Address
		villaTownhouseInvoiceDetail.PhoneNumberOfBusiness = "Coming soon"
	} else if villaTownhouseOrder.OrderType == utils.TOWN_HOUSE {
		villaTownhouse, err := GetVillaTownhouse(villaTownhouseOrder.TownhouseID.Hex())
		if err != nil {
			return villaTownhouseInvoiceDetail, err
		}
		villaTownhouseInvoiceDetail.NameOfVillaTownhouse = villaTownhouse.Name
		villaTownhouseInvoiceDetail.IdOfVillaTownhouse = villaTownhouseOrder.TownhouseID
		villaTownhouseInvoiceDetail.Address = villaTownhouse.Address
		villaTownhouseInvoiceDetail.PhoneNumberOfBusiness = "Coming soon"
	}

	//
	villaTownhouseInvoiceDetail.VillaTownhousePrice = villaTownhouseOrder.VillaTownhousePrice
	villaTownhouseInvoiceDetail.TotalSurCharge = totalSurCharges
	villaTownhouseInvoiceDetail.VAT = villaTownhouseOrder.VAT
	villaTownhouseInvoiceDetail.VATInPrice = villaTownhouseOrder.VATInPrice
	villaTownhouseInvoiceDetail.TotalPrice = villaTownhouseOrder.TotalPrice
	villaTownhouseInvoiceDetail.TotalTime = totalTime
	villaTownhouseInvoiceDetail.Discount = discount
	villaTownhouseInvoiceDetail.PaidDeposit = villaTownhouseOrder.PaidDeposit
	villaTownhouseInvoiceDetail.MustPayDeposit = villaTownhouseOrder.MustPayDeposit
	villaTownhouseInvoiceDetail.Remain = villaTownhouseOrder.Remain
	//
	//villaTownhouseInvoiceDetail.Fee = float32(fee)
	return villaTownhouseInvoiceDetail, nil
}
