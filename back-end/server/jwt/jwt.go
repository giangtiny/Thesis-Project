package jwt

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"os"
	"strings"
)

// Function for generating the tokens.
func GenerateToken(header string, payload map[string]string, secret string) (string, error) {
	h := hmac.New(sha256.New, []byte(secret))
	header64 := base64.StdEncoding.EncodeToString([]byte(header))
	payloadstr, err := json.Marshal(payload)
	if err != nil {
		return string(payloadstr), err
	}
	payload64 := base64.StdEncoding.EncodeToString(payloadstr)
	message := header64 + "." + payload64
	unsignedStr := header + string(payloadstr)
	h.Write([]byte(unsignedStr))
	signature := base64.StdEncoding.EncodeToString(h.Sum(nil))
	tokenStr := message + "." + signature
	return tokenStr, nil
}

// This helps in validating the token
func validateToken(token string, secret string) (bool, error) {
	splitToken := strings.Split(token, ".")
	if len(splitToken) != 3 {
		return false, nil
	}
	header, err := base64.StdEncoding.DecodeString(splitToken[0])
	if err != nil {
		return false, err
	}
	payload, err := base64.StdEncoding.DecodeString(splitToken[1])
	if err != nil {
		return false, err
	}
	unsignedStr := string(header) + string(payload)
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(unsignedStr))
	signature := base64.StdEncoding.EncodeToString(h.Sum(nil))
	if signature != splitToken[2] {
		return false, nil
	}
	return true, nil
}

func GetRoleOfAccount(token string) (string, error) {
	for _, role := range []string{"ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_COLLABORATOR", "ROLE_STAFF_COLLABORATOR", "ROLE_STAFF", "ROLE_USER"} {
		if check, _ := validateToken(token, os.Getenv(role)); check {
			return role, nil
		}
	}
	return "", nil
}

func GetIdOfAccount(token string) (string, error) {
	splitToken := strings.Split(token, ".")
	payload, err := base64.StdEncoding.DecodeString(splitToken[1])
	if err != nil {
		return "", err
	}
	var result struct {
		Id string `json:"id"`
	}
	err = json.Unmarshal(payload, &result)
	if err != nil {
		return "", err
	}
	return result.Id, nil
}
