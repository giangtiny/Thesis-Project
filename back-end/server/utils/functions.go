package utils

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func StringInSlice(a string, list []string) bool {
	for _, b := range list {
		if b == a {
			return true
		}
	}
	return false
}

func ObjectInSlice(element interface{}, listElement []interface{}) bool {
	for _, e := range listElement {
		if e == element {
			return true
		}
	}
	return false
}

func GenerateFromPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func CompareHashAndPassword(password, hashedPassword string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password)) == nil
}

func RemoveElementFromSlice(targetList []primitive.ObjectID, removeList []primitive.ObjectID) []primitive.ObjectID {
loop:
	for i := 0; i < len(targetList); i++ {
		target := targetList[i]
		for _, rm := range removeList {
			if target == rm {
				targetList = append(targetList[:i], targetList[i+1:]...)
				i-- // Important: decrease index
				continue loop
			}
		}
	}
	return targetList
}
