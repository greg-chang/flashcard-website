package controllers

import (
	"api/src/database"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestGetFlashcards(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("success", func(t *testing.T) {
		mockDB, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
		}
		defer mockDB.Close()
		database.DB = mockDB

		testUserID := uuid.New()
		testDeckID := uuid.New()
		starred := false
		rows := sqlmock.NewRows([]string{"id", "parent_deck", "starred", "front", "back"}).
			AddRow(uuid.New(), testDeckID, &starred, "Front One", "Back One").
			AddRow(uuid.New(), testDeckID, &starred, "Front Two", "Back Two")

		mock.ExpectQuery(`SELECT f.id, f.parent_deck, f.starred, f.front, f.back FROM flashcards f JOIN decks d ON f.parent_deck = d.id WHERE f.parent_deck = \$1 AND d.owner_id = \$2`).
			WithArgs(testDeckID, testUserID).
			WillReturnRows(rows)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{gin.Param{Key: "id", Value: testDeckID.String()}}

		originalGetUserID := GetUserIDFromClerkID
		GetUserIDFromClerkID = func(c *gin.Context) (uuid.UUID, bool) {
			return testUserID, true
		}
		defer func() { GetUserIDFromClerkID = originalGetUserID }()

		GetFlashcards(c)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "Front One")
		assert.Contains(t, w.Body.String(), "Front Two")
	})
}

func TestGetFlashcard(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("success", func(t *testing.T) {
		mockDB, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
		}
		defer mockDB.Close()
		database.DB = mockDB

		testUserID := uuid.New()
		testFlashcardID := uuid.New()
		testDeckID := uuid.New()
		starred := false
		rows := sqlmock.NewRows([]string{"id", "parent_deck", "starred", "front", "back"}).
			AddRow(testFlashcardID, testDeckID, &starred, "Front One", "Back One")

		mock.ExpectQuery(`SELECT f.id, f.parent_deck, f.starred, f.front, f.back FROM flashcards f JOIN decks d ON f.parent_deck = d.id WHERE f.id = \$1 AND d.owner_id = \$2`).
			WithArgs(testFlashcardID, testUserID).
			WillReturnRows(rows)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{gin.Param{Key: "id", Value: testFlashcardID.String()}}

		originalGetUserID := GetUserIDFromClerkID
		GetUserIDFromClerkID = func(c *gin.Context) (uuid.UUID, bool) {
			return testUserID, true
		}
		defer func() { GetUserIDFromClerkID = originalGetUserID }()

		GetFlashcard(c)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "Front One")
	})
}

func TestCreateFlashcard(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("success", func(t *testing.T) {
		mockDB, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
		}
		defer mockDB.Close()
		database.DB = mockDB

		testUserID := uuid.New()
		testDeckID := uuid.New()
		newFlashcardID := uuid.New()
		starred := false
		flashcardJSON := `{"front":"New Front","back":"New Back","starred":false}`

		mock.ExpectQuery("SELECT owner_id FROM decks WHERE id = \\$1").
			WithArgs(testDeckID).
			WillReturnRows(sqlmock.NewRows([]string{"owner_id"}).AddRow(testUserID))

		mock.ExpectQuery("INSERT INTO flashcards \\(parent_deck, starred, front, back\\) VALUES \\(\\$1, \\$2, \\$3, \\$4\\) RETURNING id").
			WithArgs(testDeckID, &starred, "New Front", "New Back").
			WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(newFlashcardID))

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{gin.Param{Key: "id", Value: testDeckID.String()}}
		c.Request, _ = http.NewRequest("POST", "/", strings.NewReader(flashcardJSON))
		c.Request.Header.Set("Content-Type", "application/json")

		originalGetUserID := GetUserIDFromClerkID
		GetUserIDFromClerkID = func(c *gin.Context) (uuid.UUID, bool) {
			return testUserID, true
		}
		defer func() { GetUserIDFromClerkID = originalGetUserID }()

		CreateFlashcard(c)

		assert.Equal(t, http.StatusCreated, w.Code)
		assert.Contains(t, w.Body.String(), newFlashcardID.String())
	})
}

func TestUpdateFlashcard(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("success", func(t *testing.T) {
		mockDB, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
		}
		defer mockDB.Close()
		database.DB = mockDB

		testUserID := uuid.New()
		testFlashcardID := uuid.New()
		starred := true
		flashcardJSON := `{"front":"Updated Front","back":"Updated Back","starred":true}`

		mock.ExpectExec(`UPDATE flashcards SET starred = \$1, front = \$2, back = \$3 WHERE id = \$4 AND parent_deck IN \(SELECT id FROM decks WHERE owner_id = \$5\)`).
			WithArgs(&starred, "Updated Front", "Updated Back", testFlashcardID, testUserID).
			WillReturnResult(sqlmock.NewResult(1, 1))

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{gin.Param{Key: "id", Value: testFlashcardID.String()}}
		c.Request, _ = http.NewRequest("PUT", "/", strings.NewReader(flashcardJSON))
		c.Request.Header.Set("Content-Type", "application/json")

		originalGetUserID := GetUserIDFromClerkID
		GetUserIDFromClerkID = func(c *gin.Context) (uuid.UUID, bool) {
			return testUserID, true
		}
		defer func() { GetUserIDFromClerkID = originalGetUserID }()

		UpdateFlashcard(c)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "Flashcard updated successfully")
	})
}

func TestDeleteFlashcard(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("success", func(t *testing.T) {
		mockDB, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
		}
		defer mockDB.Close()
		database.DB = mockDB

		testUserID := uuid.New()
		testFlashcardID := uuid.New()

		mock.ExpectExec(`DELETE FROM flashcards WHERE id = \$1 AND parent_deck IN \(SELECT id FROM decks WHERE owner_id = \$2\)`).
			WithArgs(testFlashcardID, testUserID).
			WillReturnResult(sqlmock.NewResult(1, 1))

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{gin.Param{Key: "id", Value: testFlashcardID.String()}}
		c.Request, _ = http.NewRequest("DELETE", "/", nil)

		originalGetUserID := GetUserIDFromClerkID
		GetUserIDFromClerkID = func(c *gin.Context) (uuid.UUID, bool) {
			return testUserID, true
		}
		defer func() { GetUserIDFromClerkID = originalGetUserID }()

		DeleteFlashcard(c)

		assert.Equal(t, http.StatusNoContent, w.Code)
	})
} 