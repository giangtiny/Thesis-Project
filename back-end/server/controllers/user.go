package controllers

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"trebooking/jwt"
	"trebooking/models"
	"trebooking/utils"

	"github.com/beego/beego/v2/server/web"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserController struct {
	web.Controller
}

// Login
// Get @Title Login
// @Description Login
// @Success 200
// @Failure 403 body is empty
// @router /user/login [post]
func (u *UserController) Login() {
	var input map[string]string
	if err := json.Unmarshal(u.Ctx.Input.RequestBody, &input); err != nil {
		u.CustomAbort(400, err.Error())
	}
	username := input["username"]
	password := input["password"]
	isValid, msg := utils.ValidateAPI(
		utils.ValidateUserName(username),
		utils.ValidatePassword(password),
	)
	if !isValid {
		u.Ctx.Output.Header("Content-Type", "application/json")
		u.CustomAbort(400, strings.Join(msg, ""))
	}
	if account, check := models.Login(username, password); check {
		secret := os.Getenv(account.Role)
		header := "HS256"
		claimsMap := map[string]string{
			"aud": "anh.nguyen",
			"iss": "super.admin",
			"id":  account.ID.Hex(),
		}
		token, _ := jwt.GenerateToken(header, claimsMap, secret)
		u.CustomAbort(200, token)
	} else {
		u.CustomAbort(400, "Username or password is incorrect")
	}
}

// Create Account
// Post @Title Create Account
// @Description Create account
// @Param account body models.Account true
// @Success 200
// @Failure 403 body is empty
// @router /user/signup [post]
func (u *UserController) SignUp() {
	var account models.Account
	body := u.Ctx.Input.RequestBody
	err := json.Unmarshal(body, &account)
	if err != nil {
		u.CustomAbort(403, "Body is empty")
	}
	account.Role = utils.User
	isValid, msg := utils.ValidateAPI(
		utils.ValidateUserName(account.UserName),
		utils.ValidatePassword(account.Password),
		utils.ValidateEmail(account.Email),
	)
	if !isValid {
		u.Ctx.Output.Header("Content-Type", "application/json")
		u.CustomAbort(400, strings.Join(msg, ""))
	}
	err = models.CreateAccount(&account)
	switch fmt.Sprint(err) {
	case "Account is invalid":
		u.CustomAbort(403, "Body is empty")
	case "Account exists":
		u.CustomAbort(400, "Account exists")
	default:
		u.CustomAbort(200, "Success")
	}
}

// Get information
// Get @Title Get information
// @Description Get information of account
// @Success 200
// @Failure 403 body is empty
// @router /user/info [get]
func (u *UserController) GetInfo() {
	token := u.Ctx.Request.Header.Get("Authorization")
	check, id, err := utils.Authorization(token, []interface{}{utils.Admin, utils.StaffCollaborator, utils.Staff, utils.SuperAdmin, utils.User})
	if err != nil {
		u.Abort("Error")
	}
	if !check {
		u.CustomAbort(401, "Permission denied")
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(id),
	)
	if !isValid {
		u.Ctx.Output.Header("Content-Type", "application/json")
		u.CustomAbort(400, strings.Join(msg, ""))
	}
	result, err := models.GetUser(id)
	if err != nil {
		u.CustomAbort(400, "Error database connection")
	}
	u.Data["json"] = result
	err = u.ServeJSON()
	if err != nil {
		u.CustomAbort(400, err.Error())
	}
}

// Get information of all users for admin
// Get @Title Get All users
// @Description Get information of all users
// @Success 200
// @Failure 403 body is empty
// @router /admin/user/all [get]
func (u *UserController) GetAllUsers() {
	token := u.Ctx.Request.Header.Get("Authorization")
	check, id, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	if err != nil {
		u.Abort("Error")
	}
	if !check {
		u.CustomAbort(401, "Permission denied")
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(id),
	)
	if !isValid {
		u.Ctx.Output.Header("Content-Type", "application/json")
		u.CustomAbort(400, strings.Join(msg, ""))
	}
	result, err := models.GetAllUsers()
	if err != nil {
		u.CustomAbort(400, "Error database connection")
	}
	u.Data["json"] = result
	err = u.ServeJSON()
	if err != nil {
		u.CustomAbort(400, err.Error())
	}
}

// Create Account api for admin
// Post @Title Create Account api for admin
// @Description Create account api for admin
// @Param account body models.UserInformation true
// @Success 200
// @Failure 403 body is empty
// @router /admin/user [post]
func (u *UserController) CreateAccount() {
	token := u.Ctx.Request.Header.Get("Authorization")
	check, id, err := utils.Authorization(token, []interface{}{utils.SuperAdmin, utils.Admin})
	if err != nil {
		u.Abort("Error")
	}
	if !check {
		u.CustomAbort(401, "Permission denied")
	}
	var uI models.UserInformation
	body := u.Ctx.Input.RequestBody
	err = json.Unmarshal(body, &uI)
	if err != nil {
		u.CustomAbort(403, "Body is empty")
	}
	var isValid bool
	var msg []string
	role, err := jwt.GetRoleOfAccount(strings.Split(token, " ")[1])
	if err != nil {
		u.CustomAbort(403, err.Error())
	}
	if role == utils.Admin {
		isValid, msg = utils.ValidateAPI(
			utils.ValidateObjectID(id),
			utils.ValidateUserName(uI.UserName),
			utils.ValidatePassword(uI.Password),
			utils.ValidateEmail(uI.Email),
			utils.ValidateRolesAdmin(uI.Role),
		)
	} else {
		isValid, msg = utils.ValidateAPI(
			utils.ValidateObjectID(id),
			utils.ValidateUserName(uI.UserName),
			utils.ValidatePassword(uI.Password),
			utils.ValidateEmail(uI.Email),
			utils.ValidateRolesSuperAdmin(uI.Role),
		)
	}
	if !isValid {
		u.Ctx.Output.Header("Content-Type", "application/json")
		u.CustomAbort(400, strings.Join(msg, ""))
	}
	err = models.CreateAccountAdmin(&uI)
	switch fmt.Sprint(err) {
	case "Account is invalid":
		u.CustomAbort(403, "Body is empty")
	case "Account exists":
		u.CustomAbort(400, "Account exists")
	default:
		u.CustomAbort(200, "Success")
	}
}

// Update user information for admin
// Put @Title Update user information for admin
// @Description update user information for admin
// @Param account body models.UserInformation true
// @Success 200
// @Failure 403 body is empty
// @router /admin/user/info [put]
func (u *UserController) UpdateUserInformation() {
	token := u.Ctx.Request.Header.Get("Authorization")
	check, id, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	if err != nil {
		u.Abort("Error")
	}
	if !check {
		u.CustomAbort(401, "Permission denied")
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(id),
	)
	if !isValid {
		u.Ctx.Output.Header("Content-Type", "application/json")
		u.CustomAbort(400, strings.Join(msg, ""))
	}
	var userInformation models.UserInformation
	if err := json.Unmarshal(u.Ctx.Input.RequestBody, &userInformation); err != nil {
		u.CustomAbort(403, err.Error())
	}
	err = models.UpdateUserInformation(&userInformation)
	if err != nil {
		u.CustomAbort(403, err.Error())
	}
	if err != nil {
		u.CustomAbort(400, "Error database connection")
	}
	u.Data["json"] = "Success"
	err = u.ServeJSON()
	if err != nil {
		u.CustomAbort(400, err.Error())
	}
}

// Change password
// Put @Title Change password
// @Description Change password
// @Param account body models.Account true
// @Success 200
// @Failure 403 body is empty
// @router /user [put]
func (u *UserController) ChangePassword() {
	token := u.Ctx.Request.Header.Get("Authorization")
	check, id, err := utils.Authorization(token, []interface{}{utils.Admin, utils.StaffCollaborator, utils.Staff, utils.SuperAdmin, utils.User})
	if err != nil {
		u.Abort("Error")
	}
	if !check {
		u.CustomAbort(401, "Permission denied")
	}
	var account models.Account
	body := u.Ctx.Input.RequestBody
	if json.Unmarshal(body, &account) != nil {
		u.CustomAbort(403, "Body is empty")
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(id),
		utils.ValidatePassword(account.Password),
	)
	if !isValid {
		u.Ctx.Output.Header("Content-Type", "application/json")
		u.CustomAbort(400, strings.Join(msg, ""))
	}
	account.ID, _ = primitive.ObjectIDFromHex(id)
	if models.UpdatePassword(&account) != nil {
		u.CustomAbort(400, "Error database connection")
	}
	u.CustomAbort(200, "Success")
}

// Update information
// Put @Title Update information
// @Description update information
// @Param account body models.User true
// @Success 200
// @Failure 403 body is empty
// @router /user/info [put]
func (u *UserController) UpdateInformation() {
	token := u.Ctx.Request.Header.Get("Authorization")
	check, id, err := utils.Authorization(token, []interface{}{utils.Admin, utils.StaffCollaborator, utils.Staff, utils.SuperAdmin, utils.User})
	if err != nil {
		u.Abort("Error")
	}
	if !check {
		u.CustomAbort(401, "Permission denied")
	}
	var user models.User
	if json.Unmarshal(u.Ctx.Input.RequestBody, &user) != nil {
		u.CustomAbort(403, "Body is empty")
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateStringEmpty(user.Name, "Name"),
		utils.ValidatePhone(user.PhoneNumber),
	)
	if !isValid {
		u.Ctx.Output.Header("Content-Type", "application/json")
		u.CustomAbort(400, strings.Join(msg, ""))
	}
	if models.UpdateUser(id, &user) != nil {
		u.CustomAbort(400, "Error database connection")
	}
	u.CustomAbort(200, "Success")
}

// Delete account
// Delete @Title Delete account
// @Description delete account
// @Param id path string true
// @Success 200
// @router /user/:id [delete]
func (u *UserController) DeleteAccount() {
	token := u.Ctx.Request.Header.Get("Authorization")
	id := u.GetString(":id")
	check, _, err := utils.Authorization(token, []interface{}{utils.Admin, utils.SuperAdmin})
	if err != nil {
		u.Abort(err.Error())
	}
	if !check {
		u.CustomAbort(401, "Permission denied")
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(id),
	)
	if !isValid {
		u.Ctx.Output.Header("Content-Type", "application/json")
		u.CustomAbort(400, strings.Join(msg, ""))
	}
	if err := models.DeleteAccount(id); err != nil {
		u.CustomAbort(500, err.Error())
	}
	u.CustomAbort(200, "Success")
}

// Forgot password
// Delete @Title Forgot password
// @Description forgot password
// @Success 200
// @router /user/forgot [post]
func (u *UserController) ForgotPassword() {
	var input map[string]string
	if err := json.Unmarshal(u.Ctx.Input.RequestBody, &input); err != nil {
		u.CustomAbort(400, err.Error())
	}
	email, check := input["email"]
	if !check {
		u.CustomAbort(400, "Input is invalid!")
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateEmail(email),
	)
	if !isValid {
		u.Ctx.Output.Header("Content-Type", "application/json")
		u.CustomAbort(400, strings.Join(msg, ""))
	}
	go models.ResetPassword(email)
	u.CustomAbort(200, "Success")
}

// GetWishListVillaTownhouse
// Delete @Title GetWishListVillaTownhouse
// @Description GetWishListVillaTownhouse
// @Success 200
// @router /user/wishlist/villatownhouse [get]
func (u *UserController) GetWishListVillaTownhouse() {
	u.GetWishList(0)
}

// GetWishListHotel
// Delete @Title GetWishListHotel
// @Description GetWishListHotel
// @Success 200
// @router /user/wishlist/hotel [get]
func (u *UserController) GetWishListHotel() {
	u.GetWishList(1)
}

func (u *UserController) GetWishList(t int) {
	token := u.Ctx.Request.Header.Get("Authorization")
	tokenSplit := strings.Split(token, " ")
	if len(tokenSplit) < 2 {
		u.CustomAbort(400, "Token is invalid")
	}
	id, err := jwt.GetIdOfAccount(tokenSplit[1])
	if err != nil {
		u.CustomAbort(500, err.Error())
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(id),
	)
	if !isValid {
		u.Ctx.Output.Header("Content-Type", "application/json")
		u.CustomAbort(400, strings.Join(msg, ""))
	}
	objectId, _ := primitive.ObjectIDFromHex(id)
	var result interface{}
	if t == 0 {
		result, err = models.GetWishListVillaTownhouse(objectId)
	} else {
		result, err = models.GetWishListHotel(objectId)
	}
	if err != nil {
		u.CustomAbort(500, err.Error())
	}
	u.Data["json"] = result

	if err = u.ServeJSON(); err != nil {
		u.CustomAbort(400, err.Error())
	}
}

// UpdateWishListVillaTownhouse
// Delete @Title UpdateWishListVillaTownhouse
// @Description UpdateWishListVillaTownhouse
// @Success 200
// @router /user/wishlist/villatownhouse [post]
func (u *UserController) AddToWishListVillaTownhouse() {
	u.AddDeleteWishList(0, 1)
}

// UpdateWishListHotel
// Delete @Title UpdateWishListHotel
// @Description UpdateWishListHotel
// @Success 200
// @router /user/wishlist/hotel [post]
func (u *UserController) AddToWishListHotel() {
	u.AddDeleteWishList(1, 1)
}

// DeleteFromWishListHotel
// Delete @Title DeleteFromWishListHotel
// @Description DeleteFromWishListHotel
// @Success 200
// @router /user/wishlist/hotel [delete]
func (u *UserController) DeleteFromWishListVillaTownhouse() {
	u.AddDeleteWishList(0, 0)
}

// DeleteFromWishListHotel
// Delete @Title DeleteFromWishListHotel
// @Description DeleteFromWishListHotel
// @Success 200
// @router /user/wishlist/hotel [delete]
func (u *UserController) DeleteFromWishListHotel() {
	u.AddDeleteWishList(1, 0)
}

func (u *UserController) AddDeleteWishList(t int, t1 int) {
	token := u.Ctx.Request.Header.Get("Authorization")
	tokenSplit := strings.Split(token, " ")
	if len(tokenSplit) < 2 {
		u.CustomAbort(400, "Token is invalid")
	}
	id, err := jwt.GetIdOfAccount(tokenSplit[1])
	if err != nil {
		u.CustomAbort(500, err.Error())
	}
	isValid, msg := utils.ValidateAPI(
		utils.ValidateObjectID(id),
	)
	if !isValid {
		u.Ctx.Output.Header("Content-Type", "application/json")
		u.CustomAbort(400, strings.Join(msg, ""))
	}
	var inp []string
	if err := json.Unmarshal(u.Ctx.Input.RequestBody, &inp); err != nil {
		u.CustomAbort(500, err.Error())
	}
	if t1 == 0 { // delete
		if t == 0 { // villa
			err = models.DeleteFromWishListVillaTownhouseIDs(id, inp)
		} else { // hotel
			err = models.DeleteFromWishListHotelIDs(id, inp)
		}
	} else { // add
		if t == 0 { // villa
			err = models.AddToWishListVillaTownhouseIDs(id, inp)
		} else { // hotel
			err = models.AddToWishListHotelIDs(id, inp)
		}
	}
	if err != nil {
		u.CustomAbort(500, err.Error())
	}
	u.CustomAbort(200, "Success")
}
