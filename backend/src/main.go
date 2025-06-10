package main

import (
	"database/sql"
	"log"
	"os"

	"api/src/database"
	"api/src/routes"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gin-gonic/gin"
)

func SetupRouter(db *sql.DB) *gin.Engine {
	database.DB = db

	r := routes.SetupRouter()
	return r
}

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

	r := SetupRouter(database.DB)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	log.Printf("Server starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
