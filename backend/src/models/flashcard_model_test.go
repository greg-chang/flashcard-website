package models

import (
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestFlashcardValidation(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		starred := true
		flashcard := Flashcard{
			ParentDeck: uuid.New(),
			Front:      "What is 2+2?",
			Back:       "4",
			Starred:    &starred,
		}
		err := flashcard.Validate()
		assert.NoError(t, err)
	})

	t.Run("missing parent deck", func(t *testing.T) {
		starred := true
		flashcard := Flashcard{
			Front:   "What is 2+2?",
			Back:    "4",
			Starred: &starred,
		}
		err := flashcard.Validate()
		assert.Error(t, err)
		assert.EqualError(t, err, "parent_deck is required")
	})

	t.Run("missing front", func(t *testing.T) {
		starred := true
		flashcard := Flashcard{
			ParentDeck: uuid.New(),
			Back:       "4",
			Starred:    &starred,
		}
		err := flashcard.Validate()
		assert.Error(t, err)
		assert.EqualError(t, err, "front is required")
	})

	t.Run("missing back", func(t *testing.T) {
		starred := true
		flashcard := Flashcard{
			ParentDeck: uuid.New(),
			Front:      "What is 2+2?",
			Starred:    &starred,
		}
		err := flashcard.Validate()
		assert.Error(t, err)
		assert.EqualError(t, err, "back is required")
	})

	t.Run("missing starred", func(t *testing.T) {
		flashcard := Flashcard{
			ParentDeck: uuid.New(),
			Front:      "What is 2+2?",
			Back:       "4",
		}
		err := flashcard.Validate()
		assert.Error(t, err)
		assert.EqualError(t, err, "starred is required")
	})
} 