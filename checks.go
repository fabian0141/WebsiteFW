package main

import (
	"crypto/tls"
	"log"
	"net/smtp"
	"os"

	"github.com/pkg/errors"
)

func checkFatal(e error) {
	if e != nil {
		wrappedErr := errors.Wrap(e, "An error occurred in an imported library")
		log.Printf("Crash: %+v\n", wrappedErr)
		sendEmail("WebsiteFW: Fatal Error Occurred")
		os.Exit(-1)
	}
}

func checkError(e error) bool {
	if e != nil {
		wrappedErr := errors.Wrap(e, "An error occurred in an imported library")
		log.Printf("%+v\n", wrappedErr)
		return true
	}
	return false
}

func handleFatal() {
	if err := recover(); err != nil {
		log.Println("Caught a fatal error:", err)
		sendEmail("WebsiteFW: Fatal Error Occurred")
	}
}

func sendEmail(subject string) {
	return

	mail := settings[1]
	password := settings[2]
	smtpHost := "mail.gmx.net"
	smtpPort := "465"

	message := "From: " + mail + "\n" +
		"To: " + mail + "\n" +
		"Subject: " + subject + "\n\n"

	tlsConfig := &tls.Config{
		ServerName: smtpHost,
	}
	conn, err := tls.Dial("tcp", smtpHost+":"+smtpPort, tlsConfig)
	if err != nil {
		log.Fatalf("Failed to establish TLS connection: %v", err)
	}
	defer conn.Close()

	// Create an SMTP client
	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		log.Fatalf("Failed to create SMTP client: %v", err)
	}
	defer client.Quit()

	// Authenticate with the server
	auth := smtp.PlainAuth("", mail, password, smtpHost)
	if err = client.Auth(auth); err != nil {
		log.Fatalf("SMTP authentication failed: %v", err)
	}

	// Send the email
	if err = client.Mail(mail); err != nil {
		log.Fatalf("Failed to set sender: %v", err)
	}
	if err = client.Rcpt(mail); err != nil {
		log.Fatalf("Failed to set recipient: %v", err)
	}

	w, err := client.Data()
	if err != nil {
		log.Fatalf("Failed to send data: %v", err)
	}

	_, err = w.Write([]byte(message))
	if err != nil {
		log.Fatalf("Failed to write message: %v", err)
	}
	err = w.Close()
	if err != nil {
		log.Fatalf("Failed to close write: %v", err)
	}

	log.Println("Email sent successfully.")
}
