package controllers

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"api/src/database"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestGetUsers(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("success", func(t *testing.T) {
		mockDB, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
		}
		defer mockDB.Close()
		database.DB = mockDB

		rows := sqlmock.NewRows([]string{"id", "clerk_id", "name", "email"}).
			AddRow(uuid.New(), "clerk1", "User One", "user1@example.com").
			AddRow(uuid.New(), "clerk2", "User Two", "user2@example.com")

		mock.ExpectQuery("SELECT id, clerk_id, name, email FROM users").WillReturnRows(rows)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		GetUsers(c)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.NotEmpty(t, w.Body.String())
	})

}

func TestGetUser(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("success", func(t *testing.T) {
		mockDB, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
		}
		defer mockDB.Close()
		database.DB = mockDB

		testUUID := uuid.New()
		rows := sqlmock.NewRows([]string{"id", "clerk_id", "name", "email"}).
			AddRow(testUUID, "clerk1", "User One", "user1@example.com")

		mock.ExpectQuery("SELECT id, clerk_id, name, email FROM users WHERE id = \\$1").
			WithArgs(testUUID).
			WillReturnRows(rows)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{gin.Param{Key: "id", Value: testUUID.String()}}

		GetUser(c)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), testUUID.String())
	})
}

func TestCreateUser(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("success", func(t *testing.T) {
		mockDB, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
		}
		defer mockDB.Close()
		database.DB = mockDB

		newUserID := uuid.New()
		userJSON := `{"name":"New User","email":"newuser@example.com"}`

		mock.ExpectQuery("INSERT INTO users \\(clerk_id, name, email\\) VALUES \\(\\$1, \\$2, \\$3\\) RETURNING id").
			WithArgs("test-clerk-id", "New User", "newuser@example.com").
			WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(newUserID))

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request, _ = http.NewRequest("POST", "/", strings.NewReader(userJSON))
		c.Request.Header.Set("Content-Type", "application/json")

		originalGetClerkID := getClerkID
		getClerkID = func(c *gin.Context) (string, bool) {
			return "test-clerk-id", true
		}
		defer func() { getClerkID = originalGetClerkID }()

		CreateUser(c)

		assert.Equal(t, http.StatusCreated, w.Code)
		assert.Contains(t, w.Body.String(), newUserID.String())
	})
}

func TestUpdateUser(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("success", func(t *testing.T) {
		mockDB, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
		}
		defer mockDB.Close()
		database.DB = mockDB

		testUUID := uuid.New()
		userJSON := `{"name":"Updated User","email":"updateduser@example.com"}`

		mock.ExpectExec("UPDATE users SET name = \\$1, email = \\$2 WHERE id = \\$3 AND clerk_id = \\$4").
			WithArgs("Updated User", "updateduser@example.com", testUUID, "test-clerk-id").
			WillReturnResult(sqlmock.NewResult(1, 1))

		rows := sqlmock.NewRows([]string{"id", "clerk_id", "name", "email"}).
			AddRow(testUUID, "test-clerk-id", "Updated User", "updateduser@example.com")
		mock.ExpectQuery("SELECT id, clerk_id, name, email FROM users WHERE id = \\$1").
			WithArgs(testUUID).
			WillReturnRows(rows)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{gin.Param{Key: "id", Value: testUUID.String()}}
		c.Request, _ = http.NewRequest("PUT", "/", strings.NewReader(userJSON))
		c.Request.Header.Set("Content-Type", "application/json")

		originalGetClerkID := getClerkID
		getClerkID = func(c *gin.Context) (string, bool) {
			return "test-clerk-id", true
		}
		defer func() { getClerkID = originalGetClerkID }()

		UpdateUser(c)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.Contains(t, w.Body.String(), "Updated User")
	})
}

func TestDeleteUser(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("success", func(t *testing.T) {
		mockDB, mock, err := sqlmock.New()
		if err != nil {
			t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
		}
		defer mockDB.Close()
		database.DB = mockDB

		testUUID := uuid.New()

		mock.ExpectExec("DELETE FROM users WHERE id = \\$1 AND clerk_id = \\$2").
			WithArgs(testUUID, "test-clerk-id").
			WillReturnResult(sqlmock.NewResult(1, 1))

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{gin.Param{Key: "id", Value: testUUID.String()}}
		c.Request, _ = http.NewRequest("DELETE", "/", nil)

		originalGetClerkID := getClerkID
		getClerkID = func(c *gin.Context) (string, bool) {
			return "test-clerk-id", true
		}
		defer func() { getClerkID = originalGetClerkID }()

		DeleteUser(c)

		assert.Equal(t, http.StatusNoContent, w.Code)
	})
}