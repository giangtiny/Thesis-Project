package utils

import (
	"strings"
	"trebooking/jwt"
)

func Authorization(token string, roles []interface{}) (bool, string, error) {
	tokenSplit := strings.Split(token, " ")
	if len(tokenSplit) < 2 {
		return false, "", nil
	}
	tokenString := tokenSplit[1]
	role, err := jwt.GetRoleOfAccount(tokenString)
	if err != nil {
		return false, "", err
	}
	id, err := jwt.GetIdOfAccount(tokenString)
	if err != nil {
		return false, "", err
	}
	return ObjectInSlice(role, roles), id, nil
}
