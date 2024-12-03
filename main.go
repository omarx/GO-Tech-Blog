package main

import (
	"TechBlog/connect"
	"TechBlog/controllers/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
	"time"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Connect to the database
	dbConfig, err := connect.DBConnect(
		os.Getenv("USER"),
		os.Getenv("PASS"),
		os.Getenv("DBNAME"),
	)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8005"
	}

	// Initialize Gin router
	router := gin.Default()

	// Enable CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},                   // Frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}, // Include OPTIONS for preflight requests
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.OPTIONS("/*path", func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, Accept")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Status(http.StatusNoContent)
	})

	gin.SetMode(gin.DebugMode)

	// Set up session middleware
	store := cookie.NewStore([]byte("secret"))
	router.Use(sessions.Sessions("mysession", store))

	// Serve the static frontend files from the "dist" directory
	router.Static("/static", "./frontend/build/")

	// Serve the index.html file for all other routes (fallback for React routing)
	router.NoRoute(func(c *gin.Context) {
		c.File("./frontend/build/index.html")
	})

	// Register routes
	routes.RegisterRoutes(router, dbConfig)

	// Start the server
	router.Run(":" + port)
}
