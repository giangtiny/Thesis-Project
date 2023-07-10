package utils

var HotelState = map[int]string{
	200: "Ok",
	400: "Bad request, input is invalid",
	401: "Unauthorized: Access token is invalid",
	403: "Forbidden",
	404: "Not found",
	500: "Internal server error",
}
