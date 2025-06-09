package controllers

import (
	"api/src/database"
	"database/sql"
	"net/http"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetUserIDFromClerkID retrieves the application-specific user UUID from the database
// based on the Clerk user ID from the session token.
func GetUserIDFromClerkID(c *gin.Context) (uuid.UUID, bool) {
	claims, ok := clerk.SessionClaimsFromContext(c.Request.Context())
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: No session found"})
		return uuid.Nil, false
	}
	clerkID := claims.Subject

	var userID uuid.UUID
	err := database.DB.QueryRow("SELECT id FROM users WHERE clerk_id = $1", clerkID).Scan(&userID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusForbidden, gin.H{"error": "User not found in application database"})
			return uuid.Nil, false
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user from database"})
		return uuid.Nil, false
	}

	return userID, true
}
