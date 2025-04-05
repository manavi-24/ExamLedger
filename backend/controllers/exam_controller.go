package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/avinashgarlaa/blockchain-exam-backend/models"
	"github.com/avinashgarlaa/blockchain-exam-backend/services"
)

// ValidateExam checks if the exam JSON is correctly structured
func ValidateExam(exam models.Exam) error {
	if exam.Title == "" {
		return fmt.Errorf("missing exam title")
	}
	if exam.Duration <= 0 {
		return fmt.Errorf("invalid exam duration")
	}
	if len(exam.Questions) == 0 {
		return fmt.Errorf("exam must have at least one question")
	}

	// Validate each question
	for i, q := range exam.Questions {
		if q.Question == "" {
			return fmt.Errorf("question %d is missing text", i+1)
		}
		if len(q.Options) < 2 {
			return fmt.Errorf("question %d must have at least two options", i+1)
		}
		if q.CorrectAnswer < 0 || q.CorrectAnswer >= len(q.Options) {
			return fmt.Errorf("question %d has an invalid correctAnswer index", i+1)
		}
	}
	return nil
}

// UploadExamHandler handles the request to upload an exam to IPFS
func UploadExamHandler(w http.ResponseWriter, r *http.Request) {
	// Ensure request is a POST request
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		log.Println("❌ Error: Invalid request method")
		return
	}

	// Ensure Content-Type is JSON
	if r.Header.Get("Content-Type") != "application/json" {
		http.Error(w, "Content-Type must be application/json", http.StatusUnsupportedMediaType)
		log.Println("❌ Error: Invalid Content-Type")
		return
	}

	// Decode JSON request body
	var exam models.Exam
	err := json.NewDecoder(r.Body).Decode(&exam)
	if err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		log.Println("❌ Error decoding request:", err)
		return
	}

	// Validate exam structure
	if err := ValidateExam(exam); err != nil {
		http.Error(w, "Invalid exam structure: "+err.Error(), http.StatusBadRequest)
		log.Println("❌ Error: Invalid exam structure -", err)
		return
	}

	// Upload exam data to IPFS
	cid, err := services.UploadToIPFS(exam)
	if err != nil {
		http.Error(w, "Failed to upload exam to IPFS", http.StatusInternalServerError)
		log.Println("❌ IPFS upload error:", err)
		return
	}

	// Return the CID (Content Identifier)
	response := map[string]string{"cid": cid}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)

	log.Println("✅ Exam uploaded successfully to IPFS, CID:", cid)
}
