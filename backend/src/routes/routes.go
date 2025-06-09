package routes

import (
	"api/src/controllers"
	"api/src/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRouter configures all the routes for the application
func SetupRouter() *gin.Engine {
	router := gin.Default()

	router.Use(middleware.CORS())

	router.GET("/api/go/health", controllers.HealthCheck)

	protected := router.Group("/api/go")
	protected.Use(middleware.ClerkMiddleware())
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
		protected.GET("/decks/:id/flashcards", controllers.GetFlashcards)
		protected.POST("/decks/:id/flashcards", controllers.CreateFlashcard)
		protected.GET("/flashcards/:id", controllers.GetFlashcard)
		protected.PUT("/flashcards/:id", controllers.UpdateFlashcard)
		protected.DELETE("/flashcards/:id", controllers.DeleteFlashcard)
	}

	return router
}
