package models

import (
	"fmt"

	"github.com/google/uuid"
)

type Flashcard struct {
	ID         uuid.UUID `json:"id"`
	ParentDeck uuid.UUID `json:"parent_deck" binding:"required"`
	Starred    *bool     `json:"starred" binding:"required"`
	Front      string    `json:"front" binding:"required"`
	Back       string    `json:"back" binding:"required"`
}

func (f *Flashcard) Validate() error {
	if f.ParentDeck == uuid.Nil {
		return fmt.Errorf("parent_deck is required")
	}
	if f.Front == "" {
		return fmt.Errorf("front is required")
	}
	if f.Back == "" {
		return fmt.Errorf("back is required")
	}
	if f.Starred == nil {
		return fmt.Errorf("starred is required")
	}
	return nil
}
