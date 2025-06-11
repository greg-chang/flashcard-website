package controllers

import (
	"api/src/database"
	"api/src/models"
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

// GetDecks returns all decks for a single user by ID
// Takes in the users ID as a parameter
func GetDecks(c *gin.Context) {
	userID, ok := GetUserIDFromClerkID(c)
	if !ok {
		return
	}

	rows, err := database.DB.Query(
		"SELECT id, owner_id, labels, title, description FROM decks WHERE owner_id = $1",
		userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var decks []models.Deck
	for rows.Next() {
		var d models.Deck
		if err := rows.Scan(&d.ID, &d.OwnerID, pq.Array(&d.Labels), &d.Title, &d.Description); err != nil {
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

// GetDeck returns a single deck for a single user by ID
func GetDeck(c *gin.Context) {
	deckID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	userID, ok := GetUserIDFromClerkID(c)
	if !ok {
		return
	}

	var deck models.Deck
	err = database.DB.QueryRow(
		"SELECT id, owner_id, labels, title, description FROM decks WHERE id = $1 AND owner_id = $2",
		deckID, userID,
	).Scan(&deck.ID, &deck.OwnerID, pq.Array(&deck.Labels), &deck.Title, &deck.Description)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Deck not found or access denied"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, deck)
}

// CreateDeck creates a new deck for a user
// OwnerID is taken from the URL path parameter.
// Title, Description, and Labels are taken from URL query parameters.
func CreateDeck(c *gin.Context) {
	userID, ok := GetUserIDFromClerkID(c)
	if !ok {
		return
	}

	var deck models.Deck
	if err := c.ShouldBindJSON(&deck); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	deck.OwnerID = userID

	if err := deck.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := database.DB.QueryRow(
		"INSERT INTO decks (owner_id, labels, title, description) VALUES ($1, $2, $3, $4) RETURNING id",
		deck.OwnerID, pq.StringArray(deck.Labels), deck.Title, deck.Description,
	).Scan(&deck.ID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, deck)
}

// UpdateDeck updates an existing deck
func UpdateDeck(c *gin.Context) {
	userID, ok := GetUserIDFromClerkID(c)
	if !ok {
		return
	}

	deckID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	var deck models.Deck
	if err := c.ShouldBindJSON(&deck); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	deck.OwnerID = userID

	if err := deck.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := database.DB.Exec(
		"UPDATE decks SET labels = $1, title = $2, description = $3 WHERE id = $4 AND owner_id = $5",
		pq.StringArray(deck.Labels), deck.Title, deck.Description, deckID, userID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Deck not found"})
		return
	}

	err = database.DB.QueryRow(
		"SELECT id, owner_id, labels, title, description FROM decks WHERE id = $1",
		deckID,
	).Scan(&deck.ID, &deck.OwnerID, pq.Array(&deck.Labels), &deck.Title, &deck.Description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, deck)
}

// DeleteUser deletes a deck
func DeleteDeck(c *gin.Context) {
	userID, ok := GetUserIDFromClerkID(c)
	if !ok {
		return
	}

	deckID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	result, err := database.DB.Exec("DELETE FROM decks WHERE id = $1 AND owner_id = $2", deckID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Deck not found"})
		return
	}

	c.Status(http.StatusNoContent)
}
