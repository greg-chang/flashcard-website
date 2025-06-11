package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestUserValidation(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		user := User{
			Name:  "Test User",
			Email: "test@example.com",
		}
		err := user.Validate()
		assert.NoError(t, err)
	})

	t.Run("missing name", func(t *testing.T) {
		user := User{
			Email: "test@example.com",
		}
		err := user.Validate()
		assert.Error(t, err)
		assert.EqualError(t, err, "name is required")
	})

	t.Run("missing email", func(t *testing.T) {
		user := User{
			Name: "Test User",
		}
		err := user.Validate()
		assert.Error(t, err)
		assert.EqualError(t, err, "email is required")
	})
} 