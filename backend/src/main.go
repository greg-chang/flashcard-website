package main

import (
	"log"
	"os"

	"api/src/database"
	"api/src/routes"

	"github.com/clerk/clerk-sdk-go/v2"
)

func main() {
	clerkKey := os.Getenv("CLERK_JWT_SECRET")
	if clerkKey == "" {
		log.Fatal("CLERK_JWT_SECRET environment variable not set")
	}
	clerk.SetKey(clerkKey)

	if err := database.InitDB(); err != nil {
		log.Fatal(err)
	}
	defer database.DB.Close()

	r := routes.SetupRouter()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	log.Printf("Server starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
