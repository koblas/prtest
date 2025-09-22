package main

import (
	"log"
	"os"

	"todo-backend/database"
	"todo-backend/handlers"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize database
	database.InitDatabase()

	// Set Gin mode
	ginMode := os.Getenv("GIN_MODE")
	if ginMode == "" {
		ginMode = "debug"
	}
	gin.SetMode(ginMode)

	// Create Gin router
	r := gin.Default()

	// Add CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Initialize handlers
	h := handlers.NewHandlers()

	// API routes
	api := r.Group("/api/v1")
	{
		// Health check
		api.GET("/health", h.HealthCheck)

		// Todo routes
		todos := api.Group("/todos")
		{
			todos.GET("", h.GetTodos)
			todos.POST("", h.CreateTodo)
			todos.GET("/:id", h.GetTodoByID)
			todos.PUT("/:id", h.UpdateTodo)
			todos.DELETE("/:id", h.DeleteTodo)
			todos.PATCH("/:id/complete", h.ToggleTodoCompletion)
		}
	}

	// Get port from environment or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

