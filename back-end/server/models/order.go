package models

import "go.mongodb.org/mongo-driver/bson/primitive"

const (
	Percentage = 0
	Cash       = 1
)

type Order struct {
	ID               primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	CheckIn          primitive.DateTime `bson:"checkIn" json:"checkIn"`
	CheckOut         primitive.DateTime `bson:"checkOut" json:"checkOut"`
	Gmail            string             `bson:"gmail" json:"gmail"`
	PhoneNumber      string             `bson:"phoneNumber" json:"phoneNumber"`
	UserName         string             `bson:"userName" json:"userName"`
	NumberOfCustomer uint8              `bson:"numberOfCustomer" json:"numberOfCustomer"`
	IsFullyPaid      bool               `bson:"isFullyPaid" json:"isFullyPaid"`
	IsGroupOrder     bool               `bson:"isGroupOrder" json:"isGroupOrder"`
	CreatedBy        string             `bson:"createdBy" json:"createdBy"`
	// [NEW] Fee of order
	MustPayDeposit       float32 `bson:"mustPayDeposit" json:"mustPayDeposit"` // Deposit of order in VND
	PaidDeposit          float32 `bson:"paidDeposit" json:"paidDeposit"`
	DiscountInPercentage float32 `bson:"discountInPercentage" json:"discountInPercentage"`
	DiscountInCash       float32 `bson:"discountInCash" json:"discountInCash"`
	TypeOfDiscount       int     `bson:"typeOfDiscount" json:"typeOfDiscount"`
	VAT                  float32 `bson:"vat" json:"vat"` // For VAT invoice
	VATInPrice           float32 `bson:"vatInPrice" json:"vatInPrice"`
}

type PaymentResponsePayload struct {
	Amount       float32            `json:"amount"`
	BankCode     string             `json:"bankCode"`
	PayDate      primitive.DateTime `json:"payDate"`
	OrderInfo    string             `json:"orderInfo"`
	ResponseCode string             `json:"responseCode"`
}
