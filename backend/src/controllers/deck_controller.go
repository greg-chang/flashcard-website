package controllers

import (
	"api/src/database"
	"api/src/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetDecks returns all decks for a single user by ID
// Takes in the users ID as a parameter
func GetDecks(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	rows, err := database.DB.Query(
		"SELECT id, owner_id, labels, title, description FROM decks WHERE owner_id = $1",
		id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var decks []models.Deck
	for rows.Next() {
		var d models.Deck
		if err := rows.Scan(&d.ID, &d.OwnerID, &d.Labels, &d.Title, &d.Description); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		decks = append(decks, d)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, decks)
}

// CreateDeck creates a new deck for a user
// OwnerID is taken from the URL path parameter.
// Title, Description, and Labels are taken from URL query parameters.
func CreateDeck(c *gin.Context) {
	OwnerID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	var deck models.Deck

	deck.OwnerID = OwnerID
	deck.Title = c.Query("title")
	deck.Description = c.Query("description")
	deck.Labels = c.QueryArray("labels")

	if err := deck.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = database.DB.QueryRow(
		"INSERT INTO decks (owner_id, labels, title, description) VALUES ($1, $2, $3, $4) RETURNING id",
		deck.OwnerID, deck.Labels, deck.Title, deck.Description,
	).Scan(&deck.ID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, deck)
}

// UpdateDeck updates an existing deck
