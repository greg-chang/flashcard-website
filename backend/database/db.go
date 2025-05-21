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

	// Drop existing table and create new one with UUID
	_, err = DB.Exec(`
		DROP TABLE IF EXISTS users;
		
		CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
		
		CREATE TABLE IF NOT EXISTS users (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			name VARCHAR(255) NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL,
			password VARCHAR(255) NOT NULL
		)
	`)
	if err != nil {
		return fmt.Errorf("failed to create users table: %v", err)
	}

	return nil
}
