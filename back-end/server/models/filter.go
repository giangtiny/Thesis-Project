package models

type Filter struct {
	BottomPrice   float32   `json:"bottomPrice"`
	PeakPrice     float32   `json:"peakPrice"`
	StarHotel     uint8     `json:"starHotel"`
	StarRating    uint8     `json:"starRating"`
	PaymentOption uint8     `json:"paymentOption"`
	NumberOfBed   uint8     `json:"numberOfBed"`
	Amenities     []Amenity `json:"amenities"`
}
