package utils

import (
	"encoding/json"
	"regexp"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

/*  Test case
fun main() {
	isValid, err_ := utils.ValidateAPI(
		utils.ValidatePassword("zzzzzzzzzzz"),
		utils.ValidatePassword("11111111111"),
		utils.ValidatePassword("ZZZZZZZZZZZ"),
		utils.ValidatePassword("Hoang 12324223"),
		utils.ValidatePassword("Hoang123456"),
		utils.ValidateUserName("hoang_nguyen"),
		utils.ValidateUserName("hoang1223nguyen"),
		utils.ValidateUserName("Hoang nguyen"),
	)
	if !isValid {
	fmt.Println(err_)
		//controller.CustomAbort(400, err_)
	}
}
*/

type TimeRange struct {
	start primitive.DateTime
	end   primitive.DateTime
}

type ValidationError struct {
	IsError bool        `json:"isError"`
	Input   interface{} `json:"input"`
	Msg     string      `json:"msg"`
}

func (v ValidationError) ToString() string {
	v.IsError = true
	err, _ := json.Marshal(v)
	return string(err)
}

func ValidateAPI(validations ...interface{}) (bool, []string) {
	var validationErrors []string
	isValid := true
	for _, validation := range validations {
		validationError := validation.(ValidationError)
		if validationError.IsError {
			isValid = false
			validationErrors = append(validationErrors, validationError.ToString())
		}
	}
	if len(validationErrors) == 0 {
		isValid = true
		validationErrors = nil
	}
	return isValid, validationErrors
}

// ValidateEmail : Validate email, ex: abc@hcmut.edu.vn
func ValidateEmail(email string) ValidationError {
	var emailRegex = regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
	hasMatch := emailRegex.MatchString(email)
	var msg string
	if !hasMatch {
		msg = "Email is invalid"
	}
	return ValidationError{
		IsError: !hasMatch,
		Input:   email,
		Msg:     msg,
	}
}

// ValidatePhone : Validate all phone that is available in Vietnam
func ValidatePhone(phone string) ValidationError {
	phoneRegex := regexp.MustCompile(`^((\+84|0)[3|5|7|8|9])+([0-9]{8})$`)
	hasMatch := phoneRegex.MatchString(phone)
	var msg string
	if !hasMatch {
		msg = "Phone number is invalid or not available in Vietnam"
	}
	return ValidationError{
		IsError: !hasMatch,
		Input:   phone,
		Msg:     msg,
	}
}

// ValidateStringEmpty : Validate string is empty or not
func ValidateStringEmpty(input string, objName string) ValidationError {
	isValid := len(input) > 0
	var msg string
	if !isValid {
		msg = "Input is invalid, " + objName + " can not be empty"
	}
	return ValidationError{
		IsError: !isValid,
		Input:   input,
		Msg:     msg,
	}
}

// ValidatePassword : Validate password function
func ValidatePassword(password string) ValidationError {
	if passwordRegex := regexp.MustCompile(`\s`); passwordRegex.MatchString(password) {
		return ValidationError{
			IsError: true,
			Input:   password,
			Msg:     "Password cannot contain spaces",
		}
	}
	if len(password) < 8 || len(password) > 25 {
		return ValidationError{
			IsError: true,
			Input:   password,
			Msg:     "Password must be between 8 and 25 characters",
		}
	}

	var hasLower bool
	var hasUpper bool
	var hasNumber bool
	for _, char := range password {
		if char >= 'a' && char <= 'z' {
			hasLower = true
		}
		if char >= 'A' && char <= 'Z' {
			hasUpper = true
		}
		if char >= '0' && char <= '9' {
			hasNumber = true
		}

	}
	if !hasLower || !hasUpper || !hasNumber {
		return ValidationError{
			IsError: true,
			Input:   password,
			Msg:     "Password must contain at least one uppercase letter, one lowercase letter and one number",
		}
	}
	return ValidationError{
		IsError: false,
		Input:   password,
		Msg:     "",
	}
}

// ValidateUserName : validate user name
func ValidateUserName(username string) ValidationError {
	usernameRegex := regexp.MustCompile(`^[a-zA-Z0-9_]{6,}$`)
	hasMatch := usernameRegex.MatchString(username)
	var msg string
	if !hasMatch {
		msg = "Username must be at least 6 characters and can only contain letters, numbers, and underscores"
	}
	return ValidationError{
		IsError: !hasMatch,
		Input:   username,
		Msg:     msg,
	}
}

// ValidateObjectNil is object is nil or not
func ValidateObjectNil(obj interface{}, objName string) ValidationError {
	isValid := obj != nil
	var msg string
	if !isValid {
		msg = "Input is invalid, " + objName + " can not be nil"
	}
	return ValidationError{
		IsError: !isValid,
		Input:   obj,
		Msg:     msg,
	}
}

// ValidateObjectID is object id is valid or not
func ValidateObjectID(id string) ValidationError {
	isValid := len(id) == 24
	var msg string
	if !isValid {
		msg = "Input is invalid, id is not valid"
	}
	return ValidationError{
		IsError: !isValid,
		Input:   id,
		Msg:     msg,
	}
}

// ValidateCheckInCheckOutTime : Check in time can not be later than check out time
func ValidateCheckInCheckOutTime(checkInTime primitive.DateTime, checkOutTime primitive.DateTime) ValidationError {

	if checkOutTime.Time().IsZero() {
		return ValidationError{
			IsError: false,
		}
	}

	//if checkInTime < primitive.NewDateTimeFromTime(time.Now().In(time.FixedZone("UTC+7", +7*60*60))) {
	//	return ValidationError{
	//		IsError: true,
	//		Input:   checkInTime,
	//		Msg:     "Check in time can not be earlier than now",
	//	}
	//}
	isValid := checkInTime < checkOutTime
	var msg string
	if !isValid {
		msg = "Check in time can not be greater or equal to check out time"
	}
	return ValidationError{
		IsError: !isValid,
		Input:   checkInTime,
		Msg:     msg,
	}
}

// ValidateTimeRange : Check if a specific time range is overlap with any time range in unavailable time
func ValidateTimeRange(checkInTime primitive.DateTime, checkOutTime primitive.DateTime, unavailableTime []TimeRange) ValidationError {
	var isValid bool
	isValid = true
	var msg string
	for _, timeRange := range unavailableTime {
		if checkInTime >= timeRange.start && checkInTime < timeRange.end {
			isValid = false
			msg = "Check in time is unavailable, it is in" + checkInTime.Time().String() + " - " + checkOutTime.Time().String() + " time range"
			break
		}
		if checkOutTime > timeRange.start && checkOutTime <= timeRange.end {
			isValid = false
			msg = "Check out time is unavailable, it is in" + checkInTime.Time().String() + " - " + checkOutTime.Time().String() + " time range"
			break
		}
	}
	return ValidationError{
		IsError: !isValid,
		Input:   checkInTime,
		Msg:     msg,
	}
}

func ValidateRoomNo(roomNo string) ValidationError {
	if len(roomNo) < 3 {
		return ValidationError{
			IsError: true,
			Input:   roomNo,
			Msg:     "Room number must be at least 3 chracters and start with DD, DT, FR, ST",
		}
	}
	roomCode := roomNo[0:2]
	roomCodes := []string{"DD", "DT", "FR", "ST"}
	if !StringInSlice(roomCode, roomCodes) {
		return ValidationError{
			IsError: true,
			Input:   roomNo,
			Msg:     "Room number must be at least 3 chracters and start with DD, DT, FR, ST",
		}
	}
	return ValidationError{
		IsError: false,
		Input:   roomNo,
		Msg:     "",
	}
}

func ValidateRoles(role string) ValidationError {
	for _, r := range Roles {
		if r == role {
			return ValidationError{
				IsError: false,
				Input:   r,
				Msg:     "",
			}
		}
	}
	return ValidationError{
		IsError: true,
		Input:   role,
		Msg:     "Role of user is invalid",
	}
}

func ValidateRolesSuperAdmin(role string) ValidationError {
	for _, r := range RolesSuperAdmin {
		if r == role {
			return ValidationError{
				IsError: false,
				Input:   r,
				Msg:     "",
			}
		}
	}
	return ValidationError{
		IsError: true,
		Input:   role,
		Msg:     "Role of user is invalid",
	}
}

func ValidateRolesAdmin(role string) ValidationError {
	for _, r := range RolesAdmin {
		if r == role {
			return ValidationError{
				IsError: false,
				Input:   r,
				Msg:     "",
			}
		}
	}
	return ValidationError{
		IsError: true,
		Input:   role,
		Msg:     "Role of user is invalid",
	}
}
