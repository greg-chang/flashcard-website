package config

import (
	"os"
)

// ClerkConfig holds the configuration for Clerk
type ClerkConfig struct {
	JWTSecret string
}

// GetClerkConfig returns the Clerk configuration
func GetClerkConfig() ClerkConfig {
	return ClerkConfig{
		JWTSecret: os.Getenv("CLERK_JWT_SECRET"),
	}
}
