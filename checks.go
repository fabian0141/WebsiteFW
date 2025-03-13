package main

import (
	"log"
	"os"

	"github.com/pkg/errors"
)

func checkFatal(e error) {
	if e != nil {
		wrappedErr := errors.Wrap(e, "An error occurred in an imported library")
		log.Printf("Crash: %+v\n", wrappedErr)
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
	}
}
