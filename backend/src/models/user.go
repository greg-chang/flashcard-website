package models

import (
	"fmt"

	"github.com/google/uuid"
)

type User struct {
	ID      uuid.UUID `json:"id"`
	ClerkID string    `json:"clerk_id" binding:"required"`
	Name    string    `json:"name" binding:"required"`
	Email   string    `json:"email" binding:"required"`
}

// Validate performs basic validation on the user struct
func (u *User) Validate() error {
	if u.ClerkID == "" {
		return fmt.Errorf("clerk_id is required")
	}
	if u.Name == "" {
		return fmt.Errorf("name is required")
	}
	if u.Email == "" {
		return fmt.Errorf("email is required")
	}
	return nil
}
