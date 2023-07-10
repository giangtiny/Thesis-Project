package services

import (
	"bytes"
	"fmt"
	"net/smtp"
	"os"
	"text/template"
)

func SendEmail(to []string, data interface{}, subject string, templateName string) error {
	from := os.Getenv("USERNAME_EMAIL")
	password := os.Getenv("PASSWORD_EMAIL")

	// smtp server configuration.
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	// Authentication.
	auth := smtp.PlainAuth("", from, password, smtpHost)
	t, err := template.ParseFiles("./services/email/templates/" + templateName)
	if err != nil {
		return err
	}
	var body bytes.Buffer

	subject1 := fmt.Sprintf("Subject: %s\n", subject)
	mimeHeaders := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	if err := t.Execute(&body, data); err != nil {
		return err
	}
	msg := []byte(subject1 + mimeHeaders + body.String())
	// Sending email.
	err = smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, msg)
	if err != nil {
		return err
	}
	fmt.Println("Email Sent!")
	return nil
}
