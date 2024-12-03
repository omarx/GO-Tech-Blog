package api

import (
	"TechBlog/connect"
	"TechBlog/models"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"net/http"
)

func RegisterPublicPostRoutes(router *gin.RouterGroup, dbConfig *connect.DBConfig) {
	router.GET("/posts", func(c *gin.Context) {
		handleGetAllPosts(c, dbConfig)
	})

	router.GET("/posts/:postId", func(c *gin.Context) {
		handleGetPostByID(c, dbConfig)
	})
}

// RegisterPostRoutes sets up routes for post-related actions
func RegisterPostRoutes(router *gin.RouterGroup, dbConfig *connect.DBConfig) {
	postRoutes := router.Group("/posts")
	{
		postRoutes.GET("/myposts", func(c *gin.Context) {
			handleGetMyPosts(c, dbConfig)
		})

		postRoutes.POST("/", func(c *gin.Context) {
			handleCreatePost(c, dbConfig)
		})

		postRoutes.PUT("/:postId", func(c *gin.Context) {
			handleUpdatePost(c, dbConfig)
		})

		postRoutes.DELETE("/:postId", func(c *gin.Context) {
			handleDeletePost(c, dbConfig)
		})
	}
}

// handleGetAllPosts retrieves all posts
func handleGetAllPosts(c *gin.Context, dbConfig *connect.DBConfig) {
	var posts []models.Post
	if err := dbConfig.DB.
		Preload("User").
		Preload("User.Posts").
		Preload("User.Comments").
		Preload("Comments.User").
		Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to retrieve posts", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, posts)
}

// handleGetPostByID retrieves a post by its ID
func handleGetPostByID(c *gin.Context, dbConfig *connect.DBConfig) {
	postID := c.Param("postId")
	var post models.Post
	if err := dbConfig.DB.
		Preload("User").
		Preload("User.Posts").
		Preload("User.Comments").
		Preload("Comments.User").
		First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Post not found", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, post)
}

// handleGetMyPosts retrieves posts by the logged-in user
func handleGetMyPosts(c *gin.Context, dbConfig *connect.DBConfig) {
	session := sessions.Default(c)
	userID := session.Get("user_id")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized. Please log in."})
		return
	}

	var posts []models.Post
	if err := dbConfig.DB.Where("user_id = ?", userID).Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to retrieve user posts", "error": err.Error()})
		return
	}

	if len(posts) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No posts found for this user."})
		return
	}

	c.JSON(http.StatusOK, posts)
}

// handleCreatePost creates a new post
func handleCreatePost(c *gin.Context, dbConfig *connect.DBConfig) {
	var reqBody struct {
		Title string `json:"title" binding:"required"`
		Body  string `json:"body" binding:"required"`
	}

	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request data", "error": err.Error()})
		return
	}

	session := sessions.Default(c)
	userID := session.Get("user_id")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized. Please log in."})
		return
	}

	post := models.Post{
		Title:  reqBody.Title,
		Body:   reqBody.Body,
		UserID: userID.(uint),
	}

	if err := dbConfig.DB.Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create post", "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Post created successfully",
		"post":    post,
	})
}

// handleUpdatePost updates a specific post
func handleUpdatePost(c *gin.Context, dbConfig *connect.DBConfig) {
	postID := c.Param("postId")

	session := sessions.Default(c)
	userID := session.Get("user_id")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized. Please log in."})
		return
	}

	var post models.Post
	if err := dbConfig.DB.Where("id = ? AND user_id = ?", postID, userID).First(&post).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "No post found with this ID for the logged-in user."})
		return
	}

	var reqBody struct {
		Title string `json:"title" binding:"required"`
		Body  string `json:"body" binding:"required"`
	}

	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request data", "error": err.Error()})
		return
	}

	post.Title = reqBody.Title
	post.Body = reqBody.Body

	if err := dbConfig.DB.Save(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update post", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Post updated successfully",
		"post":    post,
	})
}

// handleDeletePost deletes a specific post
func handleDeletePost(c *gin.Context, dbConfig *connect.DBConfig) {
	postID := c.Param("postId")

	session := sessions.Default(c)
	userID := session.Get("user_id")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized. Please log in."})
		return
	}

	result := dbConfig.DB.Where("id = ? AND user_id = ?", postID, userID).Delete(&models.Post{})
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No post found with this ID for the logged-in user."})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Post deleted successfully",
	})
}
