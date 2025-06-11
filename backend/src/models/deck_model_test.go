package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDeckValidation(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		deck := Deck{
			Title: "Test Deck",
		}
		err := deck.Validate()
		assert.NoError(t, err)
	})

	t.Run("missing title", func(t *testing.T) {
		deck := Deck{}
		err := deck.Validate()
		assert.Error(t, err)
		assert.EqualError(t, err, "title is required")
	})
} 