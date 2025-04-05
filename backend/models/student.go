package models

type Student struct {
	Name   string `json:"name"`
	RollNo string `json:"roll_no"`
	DOB    string `json:"dob"` // Date of Birth
	Email  string `json:"email"`
	Phone  string `json:"phone"`
}
