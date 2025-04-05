package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/avinashgarlaa/blockchain-exam-backend/models"
	"github.com/avinashgarlaa/blockchain-exam-backend/services"
)

// ValidateResult checks if the result JSON is correctly structured
func ValidateResult(result models.Result) error {
	if result.Student == "" {
		return fmt.Errorf("missing student address")
	}
	if result.ExamID <= 0 {
		return fmt.Errorf("invalid exam ID")
	}
	if result.Score <= 0 {
		return fmt.Errorf("invalid score")
	}
	if result.TotalMarks <= 0 {
		return fmt.Errorf("invalid total marks")
	}
	return nil
}

// UploadResultHandler handles result submission and uploads to IPFS
func UploadResultHandler(w http.ResponseWriter, r *http.Request) {
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
	var result models.Result
	err := json.NewDecoder(r.Body).Decode(&result)
	if err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		log.Println("❌ Error decoding request:", err)
		return
	}

	// Set the timestamp
	result.Timestamp = time.Now()

	// Validate result structure
	if err := ValidateResult(result); err != nil {
		http.Error(w, "Invalid result structure: "+err.Error(), http.StatusBadRequest)
		log.Println("❌ Error: Invalid result structure -", err)
		return
	}

	// Upload result data to IPFS
	cid, err := services.UploadToIPFS(result)
	if err != nil {
		http.Error(w, "Failed to upload result to IPFS", http.StatusInternalServerError)
		log.Println("❌ IPFS upload error:", err)
		return
	}

	// Return the CID (Content Identifier)
	response := map[string]string{"cid": cid}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)

	log.Println("✅ Result uploaded successfully to IPFS, CID:", cid)
}
