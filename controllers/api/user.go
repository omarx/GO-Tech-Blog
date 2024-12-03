package api

import (
	"TechBlog/connect"
	"TechBlog/models"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// RegisterPublicRoutes sets up public user-related routes
func RegisterPublicRoutes(router *gin.RouterGroup, dbConfig *connect.DBConfig) {
	router.POST("/login", func(c *gin.Context) {
		handleLogin(c, dbConfig)
	})

	router.POST("/signup", func(c *gin.Context) {
		handleSignup(c, dbConfig)
	})
}

// RegisterProtectedRoutes sets up protected user-related routes
func RegisterProtectedRoutes(router *gin.RouterGroup, dbConfig *connect.DBConfig) {
	router.GET("/users", func(c *gin.Context) {
		handleGetAllUsers(c, dbConfig)
	})

	router.GET("/users/:id", func(c *gin.Context) {
		handleGetUser(c, dbConfig)
	})

	router.POST("/users", func(c *gin.Context) {
		handleCreateUser(c, dbConfig)
	})

	router.DELETE("/users/:id", func(c *gin.Context) {
		handleDeleteUser(c, dbConfig)
	})
}

// handleLogin processes user login
func handleLogin(c *gin.Context, dbConfig *connect.DBConfig) {
	var reqBody struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request data", "error": err.Error()})
		return
	}

	var user models.User
	if err := dbConfig.DB.Where("username = ?", reqBody.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "No user found with the provided username"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(reqBody.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Incorrect password, please try again"})
		return
	}

	session := sessions.Default(c)
	session.Set("user_id", user.ID)
	session.Set("logged_in", true)
	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to save session", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user":    user,
		"message": "Login successful",
	})
}

// handleSignup handles user registration
func handleSignup(c *gin.Context, dbConfig *connect.DBConfig) {
	var reqBody struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request data", "error": err.Error()})
		return
	}

	newUser := models.User{
		Username: reqBody.Username,
		Email:    reqBody.Email,
		Password: reqBody.Password,
	}

	if err := dbConfig.DB.Create(&newUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create user", "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"user":    newUser,
		"message": "User registered successfully",
	})
}

// handleGetAllUsers retrieves all users (protected)
func handleGetAllUsers(c *gin.Context, dbConfig *connect.DBConfig) {
	var users []models.User
	if err := dbConfig.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to retrieve users", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, users)
}

// handleGetUser retrieves a specific user by ID (protected)
func handleGetUser(c *gin.Context, dbConfig *connect.DBConfig) {
	userID := c.Param("id")

	var user models.User
	if err := dbConfig.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

// handleCreateUser creates a new user (protected)
func handleCreateUser(c *gin.Context, dbConfig *connect.DBConfig) {
	var reqBody struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request data", "error": err.Error()})
		return
	}

	newUser := models.User{
		Username: reqBody.Username,
		Email:    reqBody.Email,
		Password: reqBody.Password,
	}

	if err := dbConfig.DB.Create(&newUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create user", "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"user":    newUser,
		"message": "User created successfully",
	})
}

// handleDeleteUser deletes a specific user by ID (protected)
func handleDeleteUser(c *gin.Context, dbConfig *connect.DBConfig) {
	userID := c.Param("id")

	if err := dbConfig.DB.Delete(&models.User{}, userID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete user", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User deleted successfully",
	})
}
