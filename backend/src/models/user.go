package models

import (
	"fmt"

	"github.com/google/uuid"
)

type User struct {
	ID       uuid.UUID `json:"id"`
	Name     string    `json:"name" binding:"required"`
	Email    string    `json:"email" binding:"required"`
	Password string    `json:"password" binding:"required"`
}

// Validate performs basic validation on the user struct
func (u *User) Validate() error {
	if u.Name == "" {
		return fmt.Errorf("name is required")
	}
	if u.Email == "" {
		return fmt.Errorf("email is required")
	}
	if u.Password == "" {
		return fmt.Errorf("password is required")
	}
	return nil
}
