package services

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
)

const IPFS_API_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS"

// UploadToIPFS uploads exam data (as JSON) to IPFS via Pinata
func UploadToIPFS(exam interface{}) (string, error) {
	// Convert exam to JSON
	jsonData, err := json.Marshal(exam)
	if err != nil {
		log.Println("❌ Error marshalling exam to JSON:", err)
		return "", err
	}

	var body bytes.Buffer
	writer := multipart.NewWriter(&body)

	// Create file field for JSON payload
	part, err := writer.CreateFormFile("file", "exam.json")
	if err != nil {
		log.Println("❌ Error creating form file:", err)
		return "", err
	}
	if _, err := part.Write(jsonData); err != nil {
		log.Println("❌ Error writing JSON to multipart:", err)
		return "", err
	}

	// Finalize multipart body
	if err := writer.Close(); err != nil {
		log.Println("❌ Error closing multipart writer:", err)
		return "", err
	}

	// Build HTTP request
	req, err := http.NewRequest("POST", IPFS_API_URL, &body)
	if err != nil {
		log.Println("❌ Error creating HTTP request:", err)
		return "", err
	}

	// Pinata auth headers
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("pinata_api_key", os.Getenv("PINATA_API_KEY"))
	req.Header.Set("pinata_secret_api_key", os.Getenv("PINATA_SECRET_API_KEY"))

	// Make the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("❌ Error making HTTP request:", err)
		return "", err
	}
	defer resp.Body.Close()

	// Read response
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("❌ Error reading response body:", err)
		return "", err
	}

	// Check for success
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusAccepted {
		log.Printf("❌ Unexpected status code %d: %s\n", resp.StatusCode, string(respBody))
		return "", errors.New("failed to upload to IPFS")
	}

	// Parse the IPFS hash from response
	var result struct {
		IpfsHash string `json:"IpfsHash"`
	}
	if err := json.Unmarshal(respBody, &result); err != nil {
		log.Println("❌ Error unmarshalling Pinata response:", err)
		return "", err
	}

	log.Println("✅ Uploaded to IPFS with CID:", result.IpfsHash)
	return result.IpfsHash, nil
}
