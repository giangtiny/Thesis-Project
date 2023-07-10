package models

import (
	"errors"
	"os"
	"trebooking/database"
	"trebooking/jwt"
	services "trebooking/services/email"
	email_models "trebooking/services/email/models"
	"trebooking/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Account struct {
	ID                        primitive.ObjectID   `bson:"_id,omitempty"`
	UserName                  string               `bson:"username" json:"username"`
	Password                  string               `bson:"password" json:"password"`
	Email                     string               `bson:"email" json:"email"`
	Role                      string               `bson:"role" json:"role"`
	UserID                    primitive.ObjectID   `bson:"userID,omitempty"`
	WishListHotelIDs          []primitive.ObjectID `bson:"wishListHotelIDs,omitempty" json:"wishListHotelIDs,omitempty"`
	WishListVillaTownhouseIDs []primitive.ObjectID `bson:"wishListVillaTownhouseIDs,omitempty" json:"wishListVillaTownhouseIDs,omitempty"`
}

type User struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	Avatar      string             `bson:"avatar" json:"avatar"`
	Name        string             `bson:"name" json:"name"`
	PhoneNumber string             `bson:"phoneNumber" json:"phoneNumber"`
	Address     string             `bson:"address" json:"address"`
	ReviewCount uint               `bson:"reviewCount" json:"reviewCount"`
}

type UserInformation struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	UserName    string             `bson:"username" json:"username"`
	Password    string             `bson:"password" json:"password"`
	Email       string             `bson:"email" json:"email"`
	Role        string             `bson:"role" json:"role"`
	Avatar      string             `bson:"avatar" json:"avatar"`
	Name        string             `bson:"name" json:"name"`
	PhoneNumber string             `bson:"phoneNumber" json:"phoneNumber"`
	Address     string             `bson:"address" json:"address"`
}

var accountCollection = database.Database.Collection("Account")
var userCollection = database.Database.Collection("User")

func init() {

}

func Login(username, password string) (Account, bool) {
	document := accountCollection.FindOne(*database.Ctx, bson.M{"username": username})
	var result Account
	if document.Decode(&result) != nil {
		return Account{}, false
	}
	if utils.CompareHashAndPassword(password, result.Password) {
		return result, true
	}
	return Account{}, false
}

func checkAccountExist(account *Account) bool {
	if account == nil {
		return false
	}
	result := accountCollection.FindOne(*database.Ctx, bson.M{"username": account.UserName})
	return result.Err() == nil
}

func GetAccountByUserID(userID primitive.ObjectID) (Account, error) {
	result := accountCollection.FindOne(*database.Ctx, bson.M{"userID": userID})

	var account Account
	if err := result.Decode(&account); err != nil {
		return account, errors.New("no account with this id")
	}

	return account, nil
}

func CreateAccount(account *Account) error {
	if account == nil {
		return errors.New("Account is invalid")
	}
	if !checkAccountExist(account) {
		userID, _ := createUser(&User{})
		if userID != primitive.NilObjectID {
			account.UserID = userID
		}
		hashedPassword, err := utils.GenerateFromPassword(account.Password)
		if err != nil {
			return err
		}
		account.Password = hashedPassword
		result, _ := accountCollection.InsertOne(*database.Ctx, account)
		if result == nil {
			return errors.New("Error database connection")
		}
		return nil
	}
	return errors.New("Account exists")
}

func createUser(user *User) (primitive.ObjectID, error) {
	if user == nil {
		return primitive.NilObjectID, errors.New("User is invalid")
	}
	result, err := userCollection.InsertOne(*database.Ctx, user)
	if err != nil {
		return primitive.NilObjectID, errors.New("Error database connection")
	}
	objectID := result.InsertedID.(primitive.ObjectID)
	user.ID = objectID
	return objectID, nil
}

func GetUser(id string) (interface{}, error) {
	lookupStage := bson.D{{Key: "$lookup", Value: bson.D{
		{Key: "from", Value: "User"},
		{Key: "localField", Value: "userID"},
		{Key: "foreignField", Value: "_id"},
		{Key: "as", Value: "user"},
	}}}
	objectId, _ := primitive.ObjectIDFromHex(id)
	matchStage := bson.D{{Key: "$match", Value: bson.D{{Key: "_id", Value: objectId}}}}
	unsetStage := bson.D{{Key: "$unset", Value: bson.A{"password"}}}
	documents, _ := accountCollection.Aggregate(*database.Ctx, mongo.Pipeline{matchStage, unsetStage, lookupStage})
	var result []bson.M
	if documents.All(*database.Ctx, &result) != nil {
		return nil, errors.New("Error database connection")
	}
	if len(result) > 0 {
		return result[0], nil
	}
	return result, nil
}

func GetUserById(id primitive.ObjectID) (User, error) {
	result := userCollection.FindOne(*database.Ctx, bson.M{"_id": id})

	var user User
	if err := result.Decode(&user); err != nil {
		return user, errors.New("no user with this id")
	}

	return user, nil
}

func GetUserByPhoneNumber(phoneNumber string) (User, error) {
	result := userCollection.FindOne(*database.Ctx, bson.M{"phoneNumber": phoneNumber})

	var user User
	if err := result.Decode(&user); err != nil {
		return user, errors.New("no user with this phone number")
	}

	return user, nil
}

func UpdatePassword(account *Account) error {
	filter := bson.D{{Key: "_id", Value: account.ID}}
	password, err := utils.GenerateFromPassword(account.Password)
	if err != nil {
		return err
	}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "password", Value: password}}}}
	_, err = accountCollection.UpdateOne(*database.Ctx, filter, update)
	return err
}

func UpdateUser(id string, user *User) error {
	accountId, _ := primitive.ObjectIDFromHex(id)
	matchStage := bson.D{{Key: "$match", Value: bson.D{{Key: "_id", Value: accountId}}}}
	addFieldsStage := bson.D{{Key: "$addFields", Value: user}}
	projectStage := bson.D{{Key: "$project", Value: bson.D{
		{Key: "phoneNumber", Value: 1},
		{Key: "address", Value: 1},
		{Key: "avatar", Value: 1},
		{Key: "name", Value: 1},
		{Key: "_id", Value: "$userID"}}}}
	mergeStage := bson.D{{Key: "$merge", Value: bson.D{{Key: "into", Value: "User"}, {Key: "whenNotMatched", Value: "fail"}}}}
	_, err := accountCollection.Aggregate(*database.Ctx, mongo.Pipeline{matchStage, addFieldsStage, projectStage, mergeStage})
	return err
}

func UpdateUserByPhonenumber(phoneNumber string, user User) error {
	updateResult, err := userCollection.UpdateOne(*database.Ctx, bson.M{"phoneNumber": phoneNumber}, bson.M{"$set": user})
	if err != nil {
		return err
	}
	if updateResult.MatchedCount == 0 {
		return errors.New("update failed")
	}

	return nil
}

func deleteUser(accountId primitive.ObjectID) error {
	var account Account
	accountResult := accountCollection.FindOne(*database.Ctx, bson.D{{Key: "_id", Value: accountId}})
	if err := accountResult.Decode(&account); err != nil {
		return err
	}
	if account.UserID == primitive.NilObjectID {
		return errors.New("User isn't exist")
	}
	if deleteResult, err := userCollection.DeleteOne(*database.Ctx, bson.M{"_id": account.UserID}); err != nil {
		return err
	} else if deleteResult.DeletedCount == 0 {
		return errors.New("User isn't exist")
	}
	return nil
}

func DeleteAccount(id string) error {
	accountId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("Id is invalid")
	}
	if err := deleteUser(accountId); err != nil {
		return err
	}
	filter := bson.D{{Key: "_id", Value: accountId}}
	if deleteResult, err := accountCollection.DeleteOne(*database.Ctx, filter); err != nil {
		return err
	} else if deleteResult.DeletedCount == 0 {
		return errors.New("Accout isn't exist")
	}
	return nil
}

func ResetPassword(email string) error {
	endpoint := "http://localhost:8080/api/v1/user/resetpassword/"
	var account Account

	accountResult := accountCollection.FindOne(*database.Ctx, bson.M{"email": email})
	if err := accountResult.Decode(&account); err != nil {
		return err
	}

	secret := os.Getenv(account.Role)
	header := "HS256"
	claimsMap := map[string]string{
		"aud": "anh.nguyen",
		"iss": "super.admin",
		"id":  account.ID.Hex(),
	}
	token, err := jwt.GenerateToken(header, claimsMap, secret)
	if err != nil {
		return err
	}
	var user User
	userResult := userCollection.FindOne(*database.Ctx, bson.M{"_id": account.UserID})
	if err := userResult.Decode(&user); err != nil {
		return err
	}
	endpoint += token
	to := []string{email}
	data := email_models.ResetPassword{
		Name: user.Name,
		Link: endpoint,
	}
	htmlTemplate := "reset_password.html"
	subject := "Thiết lập lại mật khẩu đăng nhập TreBay"
	err = services.SendEmail(to, data, subject, htmlTemplate)

	return err
}

// ops for admin
func GetAllUsers() ([]*UserInformation, error) {
	lookupStage := bson.D{{Key: "$lookup", Value: bson.D{
		{Key: "from", Value: "User"},
		{Key: "localField", Value: "userID"},
		{Key: "foreignField", Value: "_id"},
		{Key: "as", Value: "user"},
	}}}
	matchStage := bson.D{
		{
			Key: "$match",
			Value: bson.M{
				"role": bson.M{
					"$not": bson.M{"$in": primitive.A{"ROLE_SUPER_ADMIN", "ROLE_ADMIN"}},
				},
			},
		},
	}
	documents, err := accountCollection.Aggregate(*database.Ctx, mongo.Pipeline{matchStage, lookupStage})
	if err != nil {
		return nil, err
	}
	var result []map[string]interface{}
	if documents.All(*database.Ctx, &result) != nil {
		return nil, errors.New("Error database connection")
	}
	var allUser []*UserInformation
	for _, r := range result {
		user := &UserInformation{
			ID:       r["_id"].(primitive.ObjectID),
			UserName: r["username"].(string),
			Password: r["password"].(string),
			Email:    r["email"].(string),
			Role:     r["role"].(string),
		}
		userinfo := r["user"].(primitive.A)[0].(map[string]interface{})
		if avatar, ok := userinfo["avatar"]; ok {
			user.Avatar = avatar.(string)
		}
		if name, ok := userinfo["name"]; ok {
			user.Name = name.(string)
		}
		if phoneNumber, ok := userinfo["phoneNumber"]; ok {
			user.PhoneNumber = phoneNumber.(string)
		}
		if address, ok := userinfo["address"]; ok {
			user.Address = address.(string)
		}
		allUser = append(allUser, user)
	}
	return allUser, nil
}

func updateAccount(a *Account) error {
	filter := bson.D{{Key: "_id", Value: a.ID}}
	update := bson.D{{Key: "$set", Value: a}}
	_, err := accountCollection.UpdateOne(*database.Ctx, filter, update)
	return err
}

func UpdateUserInformation(u *UserInformation) error {
	user := &User{Name: u.Name, PhoneNumber: u.PhoneNumber, Address: u.Address}
	account := &Account{ID: u.ID, UserName: u.UserName, Email: u.Email, Role: u.Role}
	if u.Password != "" {
		password, err := utils.GenerateFromPassword(u.Password)
		if err != nil {
			return err
		}
		account.Password = password
	}
	if err := UpdateUser(u.ID.Hex(), user); err != nil {
		return err
	}
	if err := updateAccount(account); err != nil {
		return err
	}
	return nil
}

func CreateAccountAdmin(u *UserInformation) error {
	if u == nil {
		return errors.New("Account is invalid")
	}
	account := &Account{UserName: u.UserName, Password: u.Password, Email: u.Email, Role: u.Role}
	if checkAccountExist(account) {
		return errors.New("Account exists")
	}
	userID, _ := createUser(&User{Avatar: u.Avatar, Address: u.Address, Name: u.Name, PhoneNumber: u.PhoneNumber})
	if userID != primitive.NilObjectID {
		account.UserID = userID
	}
	hashedPassword, err := utils.GenerateFromPassword(account.Password)
	if err != nil {
		return err
	}
	account.Password = hashedPassword
	result, _ := accountCollection.InsertOne(*database.Ctx, account)
	if result == nil {
		return errors.New("Error database connection")
	}
	return nil
}
