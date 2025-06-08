package controllers

import (
	"api/src/database"
	"api/src/models"
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetFlashcards returns all flashcards from a specific deck that belongs to the authenticated user.
func GetFlashcards(c *gin.Context) {
	userID, ok := getUserIdFromClerkID(c)
	if !ok {
		return
	}

	deckID, err := uuid.Parse(c.Param("deckID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Deck UUID format"})
		return
	}

	rows, err := database.DB.Query(
		`SELECT f.id, f.parent_deck, f.starred, f.front, f.back 
		 FROM flashcards f 
		 JOIN decks d ON f.parent_deck = d.id 
		 WHERE f.parent_deck = $1 AND d.owner_id = $2`,
		deckID,
		userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var flashcards []models.Flashcard
	for rows.Next() {
		var f models.Flashcard
		if err := rows.Scan(&f.ID, &f.ParentDeck, &f.Starred, &f.Front, &f.Back); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		flashcards = append(flashcards, f)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, flashcards)
}

// GetFlashcard returns a single flashcard by its ID, ensuring it belongs to the authenticated user.
func GetFlashcard(c *gin.Context) {
	userID, ok := getUserIdFromClerkID(c)
	if !ok {
		return
	}

	flashcardID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Flashcard UUID format"})
		return
	}

	var flashcard models.Flashcard
	err = database.DB.QueryRow(
		`SELECT f.id, f.parent_deck, f.starred, f.front, f.back
		 FROM flashcards f
		 JOIN decks d ON f.parent_deck = d.id
		 WHERE f.id = $1 AND d.owner_id = $2`,
		flashcardID,
		userID,
	).Scan(&flashcard.ID, &flashcard.ParentDeck, &flashcard.Starred, &flashcard.Front, &flashcard.Back)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Flashcard not found or access denied"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve flashcard"})
		return
	}

	c.JSON(http.StatusOK, flashcard)
}

// CreateFlashcard creates a new flashcard in a specific deck.
func CreateFlashcard(c *gin.Context) {
	userID, ok := getUserIdFromClerkID(c)
	if !ok {
		return
	}

	deckID, err := uuid.Parse(c.Param("deckID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Deck UUID format"})
		return
	}

	var ownerID uuid.UUID
	err = database.DB.QueryRow("SELECT owner_id FROM decks WHERE id = $1", deckID).Scan(&ownerID)
	if err != nil || ownerID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access to deck denied"})
		return
	}

	var flashcard models.Flashcard
	if err := c.ShouldBindJSON(&flashcard); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	flashcard.ParentDeck = deckID

	if err := flashcard.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = database.DB.QueryRow(
		"INSERT INTO flashcards (parent_deck, starred, front, back) VALUES ($1, $2, $3, $4) RETURNING id",
		flashcard.ParentDeck, flashcard.Starred, flashcard.Front, flashcard.Back,
	).Scan(&flashcard.ID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create flashcard"})
		return
	}

	c.JSON(http.StatusCreated, flashcard)
}

// UpdateFlashcard updates an existing flashcard.
func UpdateFlashcard(c *gin.Context) {
	userID, ok := getUserIdFromClerkID(c)
	if !ok {
		return
	}

	flashcardID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Flashcard UUID format"})
		return
	}

	var flashcard models.Flashcard
	if err := c.ShouldBindJSON(&flashcard); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := database.DB.Exec(
		`UPDATE flashcards SET starred = $1, front = $2, back = $3
		 WHERE id = $4 AND parent_deck IN (SELECT id FROM decks WHERE owner_id = $5)`,
		flashcard.Starred, flashcard.Front, flashcard.Back, flashcardID, userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update flashcard"})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Flashcard not found or access denied"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Flashcard updated successfully"})
}

// DeleteFlashcard deletes a flashcard.
func DeleteFlashcard(c *gin.Context) {
	userID, ok := getUserIdFromClerkID(c)
	if !ok {
		return
	}

	flashcardID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Flashcard UUID format"})
		return
	}

	result, err := database.DB.Exec(
		`DELETE FROM flashcards WHERE id = $1 AND parent_deck IN (SELECT id FROM decks WHERE owner_id = $2)`,
		flashcardID, userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete flashcard"})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Flashcard not found or access denied"})
		return
	}

	c.Status(http.StatusNoContent)
}
