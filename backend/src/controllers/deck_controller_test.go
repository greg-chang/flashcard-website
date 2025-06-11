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
	"github.com/lib/pq"
	"github.com/stretchr/testify/assert"
)

func TestGetDecks(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("success", func(t *testing.T) {
		mockDB, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
		}
		defer mockDB.Close()
		database.DB = mockDB

		testUserID := uuid.New()
		rows := sqlmock.NewRows([]string{"id", "owner_id", "labels", "title", "description"}).
			AddRow(uuid.New(), testUserID, pq.Array([]string{"label1"}), "Deck One", "Description One").
			AddRow(uuid.New(), testUserID, pq.Array([]string{"label2"}), "Deck Two", "Description Two")

		mock.ExpectQuery("SELECT id, owner_id, labels, title, description FROM decks WHERE owner_id = \\$1").
			WithArgs(testUserID).
			WillReturnRows(rows)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		originalGetUserID := GetUserIDFromClerkID
		GetUserIDFromClerkID = func(c *gin.Context) (uuid.UUID, bool) {
			return testUserID, true
		}
		defer func() { GetUserIDFromClerkID = originalGetUserID }()

		GetDecks(c)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "Deck One")
		assert.Contains(t, w.Body.String(), "Deck Two")
	})
}

func TestGetDeck(t *testing.T) {
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
		rows := sqlmock.NewRows([]string{"id", "owner_id", "labels", "title", "description"}).
			AddRow(testDeckID, testUserID, pq.Array([]string{"label1"}), "Deck One", "Description One")

		mock.ExpectQuery("SELECT id, owner_id, labels, title, description FROM decks WHERE id = \\$1 AND owner_id = \\$2").
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

		GetDeck(c)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "Deck One")
	})
}

func TestCreateDeck(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("success", func(t *testing.T) {
		mockDB, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
		}
		defer mockDB.Close()
		database.DB = mockDB

		testUserID := uuid.New()
		newDeckID := uuid.New()
		deckJSON := `{"title":"New Deck","description":"New Description","labels":["new-label"]}`

		mock.ExpectQuery("INSERT INTO decks \\(owner_id, labels, title, description\\) VALUES \\(\\$1, \\$2, \\$3, \\$4\\) RETURNING id").
			WithArgs(testUserID, pq.StringArray([]string{"new-label"}), "New Deck", "New Description").
			WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(newDeckID))

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request, _ = http.NewRequest("POST", "/", strings.NewReader(deckJSON))
		c.Request.Header.Set("Content-Type", "application/json")

		originalGetUserID := GetUserIDFromClerkID
		GetUserIDFromClerkID = func(c *gin.Context) (uuid.UUID, bool) {
			return testUserID, true
		}
		defer func() { GetUserIDFromClerkID = originalGetUserID }()

		CreateDeck(c)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), newDeckID.String())
	})
}

func TestUpdateDeck(t *testing.T) {
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
		deckJSON := `{"title":"Updated Deck","description":"Updated Description","labels":["updated-label"]}`

		mock.ExpectExec("UPDATE decks SET labels = \\$1, title = \\$2, description = \\$3 WHERE id = \\$4 AND owner_id = \\$5").
			WithArgs(pq.StringArray([]string{"updated-label"}), "Updated Deck", "Updated Description", testDeckID, testUserID).
			WillReturnResult(sqlmock.NewResult(1, 1))

		rows := sqlmock.NewRows([]string{"id", "owner_id", "labels", "title", "description"}).
			AddRow(testDeckID, testUserID, pq.Array([]string{"updated-label"}), "Updated Deck", "Updated Description")
		mock.ExpectQuery("SELECT id, owner_id, labels, title, description FROM decks WHERE id = \\$1").
			WithArgs(testDeckID).
			WillReturnRows(rows)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{gin.Param{Key: "id", Value: testDeckID.String()}}
		c.Request, _ = http.NewRequest("PUT", "/", strings.NewReader(deckJSON))
		c.Request.Header.Set("Content-Type", "application/json")

		originalGetUserID := GetUserIDFromClerkID
		GetUserIDFromClerkID = func(c *gin.Context) (uuid.UUID, bool) {
			return testUserID, true
		}
		defer func() { GetUserIDFromClerkID = originalGetUserID }()

		UpdateDeck(c)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "Updated Deck")
	})
}

func TestDeleteDeck(t *testing.T) {
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

		mock.ExpectExec("DELETE FROM decks WHERE id = \\$1 AND owner_id = \\$2").
			WithArgs(testDeckID, testUserID).
			WillReturnResult(sqlmock.NewResult(1, 1))

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{gin.Param{Key: "id", Value: testDeckID.String()}}
		c.Request, _ = http.NewRequest("DELETE", "/", nil)

		originalGetUserID := GetUserIDFromClerkID
		GetUserIDFromClerkID = func(c *gin.Context) (uuid.UUID, bool) {
			return testUserID, true
		}
		defer func() { GetUserIDFromClerkID = originalGetUserID }()

		DeleteDeck(c)

		assert.Equal(t, http.StatusNoContent, w.Code)
	})
} 