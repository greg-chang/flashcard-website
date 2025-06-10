package main

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestSetupRouter(t *testing.T) {
	// Set a dummy Clerk key for testing purposes
	os.Setenv("CLERK_JWT_SECRET", "dummy-secret-key")
	defer os.Unsetenv("CLERK_JWT_SECRET")

	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockDB.Close()

	mock.ExpectExec("").WillReturnResult(sqlmock.NewResult(1, 1))

	r := SetupRouter(mockDB)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/go/health", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status code %d, got %d", http.StatusOK, w.Code)
	}
} 