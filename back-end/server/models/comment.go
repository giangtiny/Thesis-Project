package models

import (
	"errors"
	"trebooking/database"
	"trebooking/utils"

	"go.mongodb.org/mongo-driver/mongo/options"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var commentCollection = database.Database.Collection("Comment")

type Comment struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	AccommodationID primitive.ObjectID `bson:"accommodationID,omitempty" json:"accommodationID,omitempty"`
	Date            primitive.DateTime `bson:"date" json:"date"`
	Content         string             `bson:"content" json:"content"`
	UserID          primitive.ObjectID `bson:"userID,omitempty" json:"userID,omitempty"`
	UserName        string             `bson:"userName" json:"userName"`
	UserAvatar      string             `bson:"userAvatar" json:"userAvatar"`
	PhoneNumber     string             `bson:"phoneNumber" json:"phoneNumber"`
	ParentID        primitive.ObjectID `bson:"parentID,omitempty" json:"parentID,omitempty"`
	StarRating      float32            `bson:"starRating" json:"starRating"`
	Level           uint8              `bson:"level" json:"level"`
	ReplyComment    []Comment          `bson:"replyComment" json:"replyComment"`
}

// Get all level 1 comment along with their reply comments
func GetAllDetailComment(accommodationID primitive.ObjectID) ([]Comment, error) {
	var comments []Comment
	filter := bson.M{"accommodationID": accommodationID, "level": 1}
	cursor, _ := commentCollection.Find(*database.Ctx, filter)
	var tmpComment Comment
	for cursor.Next(*database.Ctx) {
		cursor.Decode(&tmpComment)
		replies, _ := getChildComment(tmpComment.ID)
		tmpComment.ReplyComment = replies
		comments = append(comments, tmpComment)
	}

	return comments, nil

}

func getChildComment(parentID primitive.ObjectID) ([]Comment, error) {
	filter := bson.M{"parentID": parentID}
	cursor, _ := commentCollection.Find(*database.Ctx, filter)
	var comments []Comment
	var comment Comment

	for cursor.Next(*database.Ctx) {
		cursor.Decode(&comment)
		replies, _ := getChildComment(comment.ID)
		comment.ReplyComment = replies
		comments = append(comments, comment)
	}
	return comments, nil
}

// func getChildComment(parentID primitive.ObjectID, parentLevel int) ([]Comment, error) {
// 	filter := bson.M{"parentID": parentID}
// 	cursor, _ := commentCollection.Find(*database.Ctx, filter)
// 	var comments []Comment

// 	if parentLevel == 1 {
// 		var comment Comment
// 		for cursor.Next(*database.Ctx) {
// 			cursor.Decode(&comment)
// 			replies, _ := getChildComment(comment.ID, 3)
// 			comment.ReplyComment = replies
// 			comments = append(comments, comment)
// 		}
// 		return comments, nil
// 	} else {
// 		cursor.All(*database.Ctx, &comments)
// 		return comments, nil
// 	}
// }

func GetPagedDetailComment(hotelID primitive.ObjectID, offset int64, maxPerPage int64) ([]Comment, error) {
	filter := bson.M{"hotelID": hotelID, "level": 1}
	opts := options.Find().SetSkip(offset).SetLimit(maxPerPage)
	cursor, err := commentCollection.Find(*database.Ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	var comments []Comment
	var tmpComment Comment
	for cursor.Next(*database.Ctx) {
		cursor.Decode(&tmpComment)
		// replies, _ := getChildComment(tmpComment.ID, 1)
		replies, _ := getChildComment(tmpComment.ID)
		tmpComment.ReplyComment = replies
		comments = append(comments, tmpComment)
	}
	return comments, nil
}

func GetCommentByID(commentID primitive.ObjectID) (Comment, error) {
	result := commentCollection.FindOne(*database.Ctx, bson.M{"_id": commentID})

	var comment Comment
	if err := result.Decode(&comment); err != nil {
		return comment, errors.New("no comment with this id")
	}

	return comment, nil
}

func AddComment(comment Comment, accommodationType string) error {
	// isValid := IsValidToAddComment(comment, accommodationType)
	// if !isValid {
	// 	return errors.New("not able to add comment")
	// }

	var user User
	var err error
	if comment.PhoneNumber == "" {
		user, err = GetUserById(comment.UserID)
		if err != nil {
			return err
		}
	} else {
		user, err = GetUserByPhoneNumber(comment.PhoneNumber)
		if err != nil {
			return err
		}
	}

	comment.UserName = user.Name
	comment.UserAvatar = user.Avatar
	comment.PhoneNumber = user.PhoneNumber
	// update field ReviewCount in User model
	account, err := GetAccountByUserID(user.ID)
	if err != nil {
		return err
	}
	if account.Role == utils.User {
		user.ReviewCount = user.ReviewCount - 1
		err = UpdateUserByPhonenumber(comment.PhoneNumber, user)
		if err != nil {
			return err
		}
	}

	_, err = commentCollection.InsertOne(*database.Ctx, comment)
	if err != nil {
		return errors.New("cannot insert comment")
	}

	// calculate the average ranking star from user's comment
	if comment.Level == 1 {
		var comments []Comment
		comments, err = GetAllComment(comment.AccommodationID)
		if err != nil {
			return err
		}
		if len(comments) > 0 {
			// fmt.Print(len(comments))
			var totalStar float32 = 0
			var commentNum int = 0

			if accommodationType == "hotel" {
				hotel, err := GetHotelById(comment.AccommodationID)
				if err != nil {
					return err
				}

				for _, comm := range comments {
					if comm.StarRating != 0 {
						totalStar += comm.StarRating
						commentNum++
					}
				}
				hotel.Rank = totalStar / float32(commentNum)

				err = UpdateHotel(comment.AccommodationID, hotel)
				if err != nil {
					return err
				}
			} else if accommodationType == "villa" {
				villa, err := GetVillaTownhouse(comment.AccommodationID.Hex())
				if err != nil {
					return err
				}

				for _, comm := range comments {
					if comm.StarRating != 0 {
						totalStar += comm.StarRating
						commentNum++
					}
				}
				villa.Star = totalStar / float32(commentNum)

				_, err = UpdateVillaTownhouse(villa)
				if err != nil {
					return err
				}
			} else if accommodationType == "townhouse" {
				townhouse, err := GetVillaTownhouse(comment.AccommodationID.Hex())
				if err != nil {
					return err
				}

				for _, comm := range comments {
					if comm.StarRating != 0 {
						totalStar += comm.StarRating
						commentNum++
					}
				}
				townhouse.Star = totalStar / float32(commentNum)

				_, err = UpdateVillaTownhouse(townhouse)
				if err != nil {
					return err
				}
			}

		}
	}

	// if added comment is a reply comment, add it to reply comments of parent comment
	// if comment.Level != 1 {
	// 	var parentComment Comment
	// 	singleResult := commentCollection.FindOne(*database.Ctx, bson.M{"_id": comment.ParentID})
	// 	if err := singleResult.Decode(&parentComment); err != nil {
	// 		return err
	// 	}
	// 	parentComment.ReplyComment = append(parentComment.ReplyComment, comment)
	// 	err := UpdateComment(comment.ParentID, parentComment)
	// 	if err != nil {
	// 		return err
	// 	}
	// }

	return nil
}

func IsValidToAddComment(comment Comment, accommodationType string) bool {
	// check if the user is replying himself
	parentComment, _ := GetCommentByID(comment.ParentID)
	if parentComment.UserID == comment.UserID {
		return false
	}

	account, err := GetAccountByUserID(comment.UserID)
	if err != nil {
		return false
	}
	if account.Role == utils.User {
		// if this comment is a reply to admin's comment, user can only reply one time
		if comment.Level != 1 {
			childComments, err := getChildComment(comment.ParentID)
			if err != nil {
				return false
			}
			parentAccount, err := GetAccountByUserID(parentComment.UserID)
			if err != nil {
				return false
			}
			// a customer can't reply to a customer
			if parentAccount.Role == utils.User {
				return false
			}
			//check reply one time only to admin comment
			if len(childComments) > 0 && parentAccount.Role != utils.User {
				return false
			}
		}
		// check if the user booked accommodations before
		// if user has account
		if comment.PhoneNumber == "" {
			user, err := GetUserById(comment.UserID)
			if err != nil {
				return false
			}
			if accommodationType == "hotel" {
				roomOrders, err := GetOrdersByPhonenumberHotelID(user.PhoneNumber, comment.AccommodationID)
				if err != nil {
					return false
				}

				if len(roomOrders) > 0 || user.ReviewCount == 0 {
					return false
				}
			} else if accommodationType == "villa" {
				villaOrders, err := getVillaOrders(bson.M{"villaID": comment.AccommodationID, "phoneNumber": user.PhoneNumber, "orderType": 1})
				if err != nil {
					return false
				}

				if len(villaOrders) > 0 || user.ReviewCount == 0 {
					return false
				}
			} else if accommodationType == "townhouse" {
				townhouseOrders, err := getTownhouseOrders(bson.M{"townhosueID": comment.AccommodationID, "phoneNumber": user.PhoneNumber, "orderType": 2})
				if err != nil {
					return false
				}

				if len(townhouseOrders) > 0 || user.ReviewCount == 0 {
					return false
				}
			}

		} else {
			// if user don't have account
			user, err := GetUserByPhoneNumber(comment.PhoneNumber)
			if err != nil {
				return false
			}
			if accommodationType == "hotel" {
				roomOrders, err := GetOrdersByPhonenumberHotelID(user.PhoneNumber, comment.AccommodationID)
				if err != nil {
					return false
				}

				if len(roomOrders) > 0 || user.ReviewCount == 0 {
					return false
				}
			} else if accommodationType == "villa" {
				villaOrders, err := getVillaOrders(bson.M{"villaID": comment.AccommodationID, "phoneNumber": user.PhoneNumber, "orderType": 1})
				if err != nil {
					return false
				}

				if len(villaOrders) > 0 || user.ReviewCount == 0 {
					return false
				}
			} else if accommodationType == "townhouse" {
				townhouseOrders, err := getTownhouseOrders(bson.M{"villaID": comment.AccommodationID, "phoneNumber": user.PhoneNumber, "orderType": 2})
				if err != nil {
					return false
				}

				if len(townhouseOrders) > 0 || user.ReviewCount == 0 {
					return false
				}
			}
		}
	}

	return true
}

func DeleteComment(id primitive.ObjectID, level int) error {
	cursor, err := commentCollection.Find(*database.Ctx, bson.M{"parentID": id})
	if err != nil {
		return err
	}

	for cursor.Next(*database.Ctx) {
		var comment Comment
		cursor.Decode(&comment)
		DeleteComment(comment.ID, level+1)
	}

	//commentCollection.DeleteMany(*database.Ctx, bson.M{"parentID": id})
	_, err = commentCollection.DeleteOne(*database.Ctx, bson.M{"_id": id})
	if err != nil {
		return err
	}

	return nil

}

func UpdateComment(id primitive.ObjectID, comment Comment) error {
	filter := bson.M{"_id": id}
	update := bson.M{"$set": comment}
	updateResult, err := commentCollection.UpdateOne(*database.Ctx, filter, update)
	if err != nil {
		return err
	}
	if updateResult.MatchedCount == 0 {
		return errors.New("update comment failed")
	}

	return nil
}

// Get all comments without reply comments
func GetAllComment(id primitive.ObjectID) ([]Comment, error) {
	filter := bson.D{
		{Key: "accommodationID", Value: id},
	}

	cursor, err := commentCollection.Find(*database.Ctx, filter)
	var comments []Comment
	cursor.All(*database.Ctx, &comments)
	if err != nil {
		return nil, errors.New("cannot get comment")
	}
	return comments, nil
}
