package models

import (
	"encoding/json"
	"time"
)

// Result struct represents a student's exam result
type Result struct {
	Student    string    `json:"student"`
	ExamID     uint      `json:"examId"`
	Score      uint      `json:"score"`
	TotalMarks uint      `json:"totalMarks"`
	Timestamp  time.Time `json:"timestamp"`
}

// Convert struct to JSON
func (r *Result) ToJSON() ([]byte, error) {
	return json.Marshal(r)
}
