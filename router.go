package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
)

func setupRoutes() {
	fileServer := http.FileServer(http.Dir("./static"))
	http.HandleFunc("/", showMain)
	http.HandleFunc("/project", showProject)
	http.HandleFunc("/data", getProjectData)
	http.HandleFunc("/project-info-to-csv", showPItoCSV)
	http.Handle("/static/", http.StripPrefix("/static/", fileServer))
}

func showMain(w http.ResponseWriter, r *http.Request) {
	println(r.URL.Path[1:])
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprint(w, mainPage)
}

func showProject(w http.ResponseWriter, r *http.Request) {
	println(r.URL.Path)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprint(w, projectPage)
}

func showPItoCSV(w http.ResponseWriter, r *http.Request) {
	content, err := os.ReadFile("static/common/projecttocsv.html")
	checkFatal(err)

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprint(w, string(content))
}

func getProjectData(w http.ResponseWriter, r *http.Request) {
	//w.Header().Set("Access-Control-Allow-Origin", "*")
	//w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	//w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	switch r.Method {
	case "GET":
		date, err := strconv.ParseInt(r.URL.Query().Get("date"), 10, 64)

		if err != nil || date < dataDate {
			w.Write(projectData)
		} else {
			w.WriteHeader(http.StatusConflict)
		}

	case "POST":
		password := r.URL.Query().Get("password")
		if password != settings[0] {
			log.Println("Password wrong.")
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		body, err := ioutil.ReadAll(r.Body)
		if checkError(err) {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		projectData = body
		if !saveDataFile() {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		w.Write([]byte("{\"date\":" + fmt.Sprint(dataDate) + "}"))

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprintf(w, "I can't do that.")
	}
}
