package api

import (
	"TechBlog/connect"
	"TechBlog/models"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// RegisterCommentRoutes sets up routes for comments
func RegisterCommentRoutes(router *gin.RouterGroup, dbConfig *connect.DBConfig) {
	commentRoutes := router.Group("/comments")
	{
		commentRoutes.POST("/", func(c *gin.Context) {
			handleCreateComment(c, dbConfig)
		})
		commentRoutes.PUT("/:commentId", func(c *gin.Context) {
			handleUpdateComment(c, dbConfig)
		})
		commentRoutes.DELETE("/:commentId", func(c *gin.Context) {
			handleDeleteComment(c, dbConfig)
		})
	}
}

// handleCreateComment handles creating a comment
func handleCreateComment(c *gin.Context, dbConfig *connect.DBConfig) {
	// Parse request body
	var reqBody struct {
		Body   string `json:"body" binding:"required"`
		PostID uint   `json:"post_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Comment body and associated post ID are required.", "error": err.Error()})
		return
	}

	// Retrieve the logged-in user's ID from the session
	session := sessions.Default(c)
	userID := session.Get("user_id")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized. Please log in."})
		return
	}

	// Convert userID to uint
	userIDUint, ok := userID.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Invalid user ID in session."})
		return
	}

	// Create the new comment
	comment := models.Comment{
		Body:   reqBody.Body,
		PostID: reqBody.PostID,
		UserID: userIDUint,
	}

	if err := dbConfig.DB.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create comment.", "error": err.Error()})
		return
	}

	// Return the created comment as the response
	c.JSON(http.StatusCreated, gin.H{
		"message": "Comment created successfully.",
		"comment": comment,
	})
}

// handleDeleteComment handles deleting a comment by its ID
func handleDeleteComment(c *gin.Context, dbConfig *connect.DBConfig) {
	// Extract comment ID from the URL
	commentID := c.Param("commentId")

	// Retrieve the logged-in user's ID from the session
	session := sessions.Default(c)
	userID := session.Get("user_id")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized. Please log in."})
		return
	}

	// Convert userID to uint
	userIDUint, ok := userID.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Invalid user ID in session."})
		return
	}

	// Check if the comment exists and belongs to the user
	var comment models.Comment
	if err := dbConfig.DB.Where("id = ? AND user_id = ?", commentID, userIDUint).First(&comment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Comment not found or you are not authorized to delete this comment."})
		return
	}

	// Delete the comment
	if err := dbConfig.DB.Delete(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete comment.", "error": err.Error()})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully."})
}

func handleUpdateComment(c *gin.Context, dbConfig *connect.DBConfig) {
	// Extract comment ID from the URL
	commentID := c.Param("commentId")

	// Retrieve the logged-in user's ID from the session
	session := sessions.Default(c)
	userID := session.Get("user_id")
	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized. Please log in."})
		return
	}

	// Convert userID to uint
	userIDUint, ok := userID.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Invalid user ID in session."})
		return
	}

	// Parse the request body
	var reqBody struct {
		Body string `json:"body" binding:"required"`
	}

	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Comment body is required.", "error": err.Error()})
		return
	}

	// Check if the comment exists and belongs to the user
	var comment models.Comment
	if err := dbConfig.DB.Where("id = ? AND user_id = ?", commentID, userIDUint).First(&comment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Comment not found or you are not authorized to update this comment."})
		return
	}

	// Update the comment
	comment.Body = reqBody.Body
	if err := dbConfig.DB.Save(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update comment.", "error": err.Error()})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{"message": "Comment updated successfully.", "comment": comment})
}
