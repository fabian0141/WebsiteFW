package main

import (
	"crypto/tls"
	"encoding/csv"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"path/filepath"
	"strings"

	"github.com/pkg/errors"
)

var mainPage string
var projectPage string
var projectData map[string][]byte

func setupRoutes() {
	fileServer := http.FileServer(http.Dir("./static"))
	http.HandleFunc("/", showMain)
	http.HandleFunc("/project", showProject)
	http.HandleFunc("/project-data", getProjectData)
	http.HandleFunc("/project-info-to-csv", showPItoCSV)
	http.Handle("/static/", http.StripPrefix("/static/", fileServer))
}

func showMain(w http.ResponseWriter, r *http.Request) {
	println(r.URL.Path[1:])
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprintf(w, mainPage)
}

func showProject(w http.ResponseWriter, r *http.Request) {
	println(r.URL.Path)
	lang := r.URL.Query().Get("lang")
	println(lang)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprintf(w, projectPage)
}

func showPItoCSV(w http.ResponseWriter, r *http.Request) {
	content, err := os.ReadFile("static/common/projecttocsv.html")
	checkFatal(err)

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprintf(w, string(content))
}

func getProjectData(w http.ResponseWriter, r *http.Request) {
	//w.Header().Set("Access-Control-Allow-Origin", "*")
	//w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	//w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	projectLang := r.URL.Query().Get("project") + r.URL.Query().Get("lang")

	switch r.Method {
	case "GET":
		println(string(projectData[projectLang]))
		w.Write(projectData[projectLang])
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprintf(w, "I can't do that.")
	}
}

func getAllHtmlFiles() []string {
	var files []string

	err := filepath.WalkDir("static", func(path string, entry fs.DirEntry, err error) error {
		checkFatal(err)

		// Check if the entry is a file and has .html extension
		if !entry.IsDir() && strings.HasSuffix(strings.ToLower(entry.Name()), ".html") {
			// Get the relative path
			relPath, err := filepath.Rel(".", path)
			relPath = strings.ReplaceAll(relPath, "\\", "/")
			checkFatal(err)
			files = append(files, relPath)
		}
		return nil
	})
	checkFatal(err)

	return files
}

func compileMainPage(htmlFiles []string) {
	content, err := os.ReadFile("static/index.html")
	checkFatal(err)
	mainPage = string(content)

	// Loop through the files in the folder
	for _, file := range htmlFiles {
		content, err := os.ReadFile(file)
		checkFatal(err)

		placeholder := fmt.Sprintf(`<insert file="%s">`, file)
		mainPage = strings.Replace(mainPage, placeholder, string(content), -1)
	}
}

func compileProjectPage(htmlFiles []string) {
	content, err := os.ReadFile("static/projectpage/index.html")
	checkFatal(err)
	projectPage = string(content)

	// Loop through the files in the folder
	for _, file := range htmlFiles {
		content, err := os.ReadFile(file)
		checkFatal(err)

		placeholder := fmt.Sprintf(`<insert file="%s">`, file)
		projectPage = strings.Replace(projectPage, placeholder, string(content), -1)
	}
}

func readCsvFile(filePath string) map[string][]byte {
	f, err := os.Open(filePath)
	if err != nil {
		log.Fatal("Unable to read input file "+filePath, err)
	}
	defer f.Close()

	csvReader := csv.NewReader(f)
	records, err := csvReader.ReadAll()
	if err != nil {
		log.Fatal("Unable to parse file as CSV for "+filePath, err)
	}

	data := make(map[string][]byte)
	header := records[0]
	for _, proj := range records[1:] {

		json := "{"
		for i, title := range header[1:] {
			json += "\"" + title + "\": \"" + proj[i+1] + "\", "
		}
		json = json[:len(json)-2]
		json += "}"
		data[proj[0]] = []byte(json)
	}

	return data
}

func main() {
	println("Start Serving")
	
	defer handleFatal()
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	defer func() {
		if r := recover(); r != nil {
			err := errors.Errorf("Panic occurred: %v", r)
			log.Printf("%+v\n", err)
		}
	}()

	htmlFiles := getAllHtmlFiles()
	compileMainPage(htmlFiles)
	compileProjectPage(htmlFiles)

	projectData = readCsvFile("static/projectpage/project.csv")

	setupRoutes()
	checkFatal(http.ListenAndServe(":80", nil))
}

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
	data, err := os.ReadFile("/Settings/WebsiteFW.conf")
	if err != nil {
		log.Println(err)
	}
	connectionSettings := strings.Split(string(data), "\n")

	mail := connectionSettings[0]
	password := connectionSettings[1]
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
