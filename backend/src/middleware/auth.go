package middleware

import (
	"net/http"

	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
	"github.com/gin-gonic/gin"
)

// ClerkMiddleware is a middleware that validates JWT tokens using Clerk
func ClerkMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		clerkHandler := clerkhttp.RequireHeaderAuthorization()(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			c.Request = r
			c.Next()
		}))

		clerkHandler.ServeHTTP(c.Writer, c.Request)

		if c.IsAborted() {
			return
		}
	}
}
