package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/avinashgarlaa/blockchain-exam-backend/models"
	"github.com/avinashgarlaa/blockchain-exam-backend/services"
)

// RegisterStudentHandler handles student registration and uploads to IPFS
func RegisterStudentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	var student models.Student
	err := json.NewDecoder(r.Body).Decode(&student)
	if err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	// Upload full student details to IPFS
	cid, err := services.UploadToIPFS(student)
	if err != nil {
		http.Error(w, "Failed to upload student data to IPFS", http.StatusInternalServerError)
		return
	}

	// Return CID and essential student details for blockchain storage
	response := map[string]string{
		"cid":     cid,
		"name":    student.Name,
		"roll_no": student.RollNo,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
