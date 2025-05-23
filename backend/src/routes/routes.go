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
		router.GET("/api/go/users", controllers.GetUsers)
		router.GET("/api/go/users/:id", controllers.GetUser)
		router.POST("/api/go/users", controllers.CreateUser)
		router.PUT("/api/go/users/:id", controllers.UpdateUser)
		router.DELETE("/api/go/users/:id", controllers.DeleteUser)

		// Deck routes (to be implemented) basic ROUTER method
		// router.GET("api/go/decks", controllers.GetDecks)
		// router.GET("api/go/decks/:id", controllers.GetDeck)
		// router.POST("api/go/decks", controllers.CreateDeck)
		// router.PUT("api/go/decks/:id", controllers.UpdateDeck)
		// router.DELETE("api/go/decks/:id", controllers.DeleteDeck)

		// Flashcard routes (to be implemented) using Protected method
		// protected.GET("/flashcards", controllers.GetFlashcards)
		// protected.GET("/flashcards/:id", controllers.GetFlashcard)
		// protected.POST("/flashcards", controllers.CreateFlashcard)
		// protected.PUT("/flashcards/:id", controllers.UpdateFlashcard)
		// protected.DELETE("/flashcards/:id", controllers.DeleteFlashcard)
	}

	return router
}
