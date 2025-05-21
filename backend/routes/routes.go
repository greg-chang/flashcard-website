package routes

import (
	"api/controllers"
	"api/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRouter configures all the routes for the application
func SetupRouter() *gin.Engine {
	r := gin.Default()

	// CORS middleware
	r.Use(middleware.CORS())

	// User routes
	userRoutes := r.Group("/api/go/users")
	{
		userRoutes.GET("", controllers.GetUsers)
		userRoutes.POST("", controllers.CreateUser)
		userRoutes.GET("/:id", controllers.GetUser)
		userRoutes.PUT("/:id", controllers.UpdateUser)
		userRoutes.DELETE("/:id", controllers.DeleteUser)
	}

	return r
}
