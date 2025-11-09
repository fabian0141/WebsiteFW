package main

import (
	"encoding/binary"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/pkg/errors"
)

var mainPage string
var projectPage string
var projectData []byte
var dataDate int64
var settings []string
var dataPath = "../Data/WebsiteFW.data"

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

func saveDataFile(body []byte) bool {
	file, err := os.OpenFile(dataPath, os.O_WRONLY, 0666)
	if checkError(err) {
		return false
	}
	defer file.Close()

	err = file.Truncate(0)
	if checkError(err) {
		return false
	}

	data := make([]byte, 8)
	dataDate = time.Now().UnixNano()
	binary.LittleEndian.PutUint64(data, uint64(dataDate))
	data = append(data, body...)
	_, err = file.Write(data)
	return !checkError(err)
}

func readDataFile() {
	file, err := os.Open(dataPath)
	checkFatal(err)
	defer file.Close()
	fi, err := file.Stat()
	checkFatal(err)

	data := make([]byte, fi.Size())
	_, err = file.Read(data)
	checkFatal(err)

	if len(data) > 0 {
		dataDate = int64(binary.LittleEndian.Uint64(data[:8]))
		projectData = []byte(fmt.Sprintf("[%d,%s]", dataDate, string(data[8:])))

	} else {
		dataDate = time.Now().UnixNano()
		projectData = []byte(fmt.Sprintf("[%d,{order:[]}]", dataDate))
	}
}

func redirectToHTTPS(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://"+r.Host+r.RequestURI, http.StatusMovedPermanently)
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

	//saveDataFile()

	data, err := os.ReadFile("../Settings/WebsiteFW.conf")
	if err != nil {
		log.Println(err)
	}
	settings = strings.Split(string(data), "\n")

	htmlFiles := getAllHtmlFiles()
	compileMainPage(htmlFiles)
	compileProjectPage(htmlFiles)

	readDataFile()
	setupRoutes()

	if settings[1] == "localhost" {
		checkFatal(http.ListenAndServe(":80", nil))
	} else {
		go func() {
			err := http.ListenAndServe(":80", http.HandlerFunc(redirectToHTTPS))
			checkFatal(err)
		}()

		checkFatal(http.ListenAndServeTLS(settings[1], settings[2], settings[3], nil))
	}
}
