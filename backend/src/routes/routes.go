package routes

import (
	"api/src/controllers"
	"api/src/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRouter configures all the routes for the application
func SetupRouter() *gin.Engine {
	router := gin.Default()

	// Apply CORS middleware to all routes
	router.Use(middleware.CORS())

	// Public routes
	router.GET("/api/go/health", controllers.HealthCheck)

	// Protected routes (to be implemented)
	protected := router.Group("/api/go")
	protected.Use(middleware.JWTAuthMiddleware())
	{
		protected.GET("/users", controllers.GetUsers)
		protected.GET("/users/:id", controllers.GetUser)
		protected.POST("/users", controllers.CreateUser)
		protected.PUT("/users/:id", controllers.UpdateUser)
		protected.DELETE("/users/:id", controllers.DeleteUser)

		protected.GET("/decks", controllers.GetDecks)
		protected.GET("/decks/:id", controllers.GetDeck)
		protected.POST("/decks", controllers.CreateDeck)
		protected.PUT("/decks/:id", controllers.UpdateDeck)
		protected.DELETE("/decks/:id", controllers.DeleteDeck)

		// Flashcard routes
		protected.GET("/decks/:deckID/flashcards", controllers.GetFlashcards)
		protected.POST("/decks/:deckID/flashcards", controllers.CreateFlashcard)
		protected.GET("/flashcards/:id", controllers.GetFlashcard)
		protected.PUT("/flashcards/:id", controllers.UpdateFlashcard)
		protected.DELETE("/flashcards/:id", controllers.DeleteFlashcard)
	}

	return router
}
