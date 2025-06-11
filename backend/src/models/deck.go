package models

import (
	"fmt"

	"github.com/google/uuid"
)

type Deck struct {
	ID          uuid.UUID `json:"id"`
	OwnerID     uuid.UUID `json:"owner_id"`
	Labels      []string  `json:"labels"`
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description"`
}

func (d *Deck) Validate() error {
	if d.Title == "" {
		return fmt.Errorf("title is required")
	}
	return nil
}
