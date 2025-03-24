package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"
	"strconv"
	"time"
)

type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
	size       int
}

func (lw *loggingResponseWriter) WriteHeader(code int) {
	lw.statusCode = code
	lw.ResponseWriter.WriteHeader(code)
}

func (lw *loggingResponseWriter) Write(b []byte) (int, error) {
	size, err := lw.ResponseWriter.Write(b)
	lw.size += size
	return size, err
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		ip, _, err := net.SplitHostPort(r.RemoteAddr)
		if err != nil {
			ip = r.RemoteAddr // Fallback to full address if parsing fails
		}

		lw := &loggingResponseWriter{ResponseWriter: w, statusCode: http.StatusOK}

		// Call the next handler
		next.ServeHTTP(lw, r)

		// Create log entry
		logEntry := fmt.Sprintf("%s - - [%s] \"%s %s %s\" %d %d\n",
			ip,
			time.Now().Format("02/Jan/2006:15:04:05 -0700"),
			r.Method,
			r.URL.Path,
			r.Proto,
			lw.statusCode, // Default response code (consider wrapping ResponseWriter to capture actual codes)
			lw.size,       // Placeholder for response size
		)

		// Write log to file
		logFile, err := os.OpenFile("../Logs/WebsiteFW.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if checkError(err) {
			return
		}
		defer logFile.Close()
		logFile.WriteString(logEntry)
	})
}

func setupRoutes() {
	fileServer := http.FileServer(http.Dir("./static"))
	http.Handle("/", loggingMiddleware(http.HandlerFunc(showMain)))
	http.Handle("/project", loggingMiddleware(http.HandlerFunc(showProject)))
	http.Handle("/data", loggingMiddleware(http.HandlerFunc(getProjectData)))
	http.Handle("/project-info-to-csv", loggingMiddleware(http.HandlerFunc(showPItoCSV)))
	http.Handle("/static/", loggingMiddleware(http.StripPrefix("/static/", fileServer)))
}

func showMain(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprint(w, mainPage)
}

func showProject(w http.ResponseWriter, r *http.Request) {
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

		if !saveDataFile(body) {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		projectData = []byte(fmt.Sprintf("[%d,%s]", dataDate, string(body)))
		w.Write([]byte(fmt.Sprint(dataDate)))

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprintf(w, "I can't do that.")
	}
}
