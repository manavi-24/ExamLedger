package routes

import (
	"net/http"

	"github.com/avinashgarlaa/blockchain-exam-backend/controllers"
)

// SetupExamRoutes sets up the exam-related routes
func SetupExamRoutes() {
	http.HandleFunc("/upload_exam", controllers.UploadExamHandler)
	http.HandleFunc("/submit_exam", controllers.SubmitExamHandler)
	http.HandleFunc("/register_student", controllers.RegisterStudentHandler)
	http.HandleFunc("/upload_result", controllers.UploadResultHandler)
}
