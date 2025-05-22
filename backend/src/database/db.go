package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var DB *sql.DB

// InitDB initializes the database connection
func InitDB() error {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@db:5432/flashcardDB?sslmode=disable"
	}

	var err error
	for i := 0; i < 5; i++ {
		DB, err = sql.Open("postgres", dbURL)
		if err != nil {
			log.Printf("Failed to connect to database, retrying in 5 seconds... (attempt %d/5)", i+1)
			time.Sleep(5 * time.Second)
			continue
		}

		err = DB.Ping()
		if err == nil {
			break
		}
		log.Printf("Failed to ping database, retrying in 5 seconds... (attempt %d/5)", i+1)
		time.Sleep(5 * time.Second)
	}
	if err != nil {
		return fmt.Errorf("could not connect to database after 5 attempts: %v", err)
	}

	// Set connection pool settings
	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(25)
	DB.SetConnMaxLifetime(5 * time.Minute)

	// Read and execute setup.sql
	sqlBytes, err := os.ReadFile("setup.sql")
	if err != nil {
		return fmt.Errorf("failed to read setup.sql: %v", err)
	}

	_, err = DB.Exec(string(sqlBytes))
	if err != nil {
		return fmt.Errorf("failed to execute setup.sql: %v", err)
	}

	return nil
}
