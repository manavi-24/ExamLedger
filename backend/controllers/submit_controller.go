package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/avinashgarlaa/blockchain-exam-backend/models"
	"github.com/avinashgarlaa/blockchain-exam-backend/services"
)

// SubmitExamHandler handles the request to upload a submitted exam to IPFS
func SubmitExamHandler(w http.ResponseWriter, r *http.Request) {
	// Ensure request is a POST request
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	// Decode JSON request body into the Submission struct
	var submission models.Submission
	err := json.NewDecoder(r.Body).Decode(&submission)
	if err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		log.Println("❌ Error decoding request:", err)
		return
	}

	// Upload submission data to IPFS
	cid, err := services.UploadToIPFS(submission)
	if err != nil {
		http.Error(w, "Failed to upload exam submission to IPFS", http.StatusInternalServerError)
		log.Println("❌ IPFS upload error:", err)
		return
	}

	// Return the CID (Content Identifier)
	response := map[string]string{"cid": cid}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)

	log.Println("✅ Exam submission uploaded successfully to IPFS, CID:", cid)
}
