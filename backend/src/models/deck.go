package models

import (
	"fmt"

	"github.com/google/uuid"
)

type Deck struct {
	ID          uuid.UUID `json:"id"`
	OwnerID     uuid.UUID `json:"owner_id" binding:"required"`
	Labels      []string  `json:"labels"`
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description"`
}

// Validate performs basic validation on the deck struct
func (d *Deck) Validate() error {
	if d.OwnerID == uuid.Nil {
		return fmt.Errorf("owner_id is required")
	}
	if d.Title == "" {
		return fmt.Errorf("title is required")
	}
	return nil
}
