package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/avinashgarlaa/blockchain-exam-backend/config"
	"github.com/avinashgarlaa/blockchain-exam-backend/routes"
)

func main() {
	// Connect to QuickNode
	client := config.ConnectQuickNode()
	defer client.Close()

	fmt.Println("✅ Connected to QuickNode")
	// Setup Routes
	routes.SetupExamRoutes()

	// Get PORT from environment (Render requires this)
	port := os.Getenv("PORT")
	if port == "" {
		port = "9090" // fallback for local dev
	}

	fmt.Println("🚀 Server is running on http://localhost:" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
