package models

type Submission struct {
	ExamID   uint     `json:"examId"`
	UserID   string   `json:"userId"`
	Answers  []string `json:"answers"`
	Metadata string   `json:"metadata"` // Additional info if needed
}
