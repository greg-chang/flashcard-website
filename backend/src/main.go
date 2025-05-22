package main

import (
	"log"
	"os"

	"api/src/database"
	"api/src/routes"
)

func main() {
	// Initialize database
	if err := database.InitDB(); err != nil {
		log.Fatal(err)
	}
	defer database.DB.Close()

	// Setup router
	r := routes.SetupRouter()

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	log.Printf("Server starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
