package models

type Question struct {
	Question      string   `json:"question"`
	Options       []string `json:"options"`
	CorrectAnswer int      `json:"correctAnswer"`
}

type Exam struct {
	Title     string     `json:"title"`
	Duration  int        `json:"duration"`
	Questions []Question `json:"questions"`
}
