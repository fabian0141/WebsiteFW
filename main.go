package main

import (
	"log"
	"net/http"
	"os"

	"github.com/pkg/errors"
)

func setupRoutes() {
	fileServer := http.FileServer(http.Dir("./static"))
	http.HandleFunc("/", showPrintPage)
	http.Handle("/static/", http.StripPrefix("/static/", fileServer))
}

func showPrintPage(w http.ResponseWriter, r *http.Request) {
	print(r.URL.Path[1:])
	var url = r.URL.Path[1:]
	if url == "" {
		url = "static/index.html"
	}
	http.ServeFile(w, r, url)
	/*pageContent, err := os.ReadFile("./static/index.html")
	templates := template.New("template")
	templates.New("doc").Parse(string(pageContent))
	templates.Lookup("doc").Execute(w, context)
	fmt.Fprintf(w, "Hello, World!")*/
}

func main() {
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	defer func() {
		if r := recover(); r != nil {
			err := errors.Errorf("Panic occurred: %v", r)
			log.Printf("%+v\n", err)
		}
	}()

	setupRoutes()
	checkFatal(http.ListenAndServe(":43543", nil))
}

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
