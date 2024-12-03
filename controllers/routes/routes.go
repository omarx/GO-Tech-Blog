package routes

import (
	"TechBlog/connect"
	"TechBlog/controllers/api"
	"TechBlog/utils"
	"github.com/gin-gonic/gin"
)

// RegisterRoutes sets up all routes for the application
func RegisterRoutes(router *gin.Engine, dbConfig *connect.DBConfig) {
	// Public routes
	publicRoutes := router.Group("/api/")
	api.RegisterPublicRoutes(publicRoutes, dbConfig)
	api.RegisterPublicPostRoutes(publicRoutes, dbConfig)

	// Protected routes
	protectedRoutes := router.Group("/api/")
	protectedRoutes.Use(utils.WithAuth())
	{
		api.RegisterProtectedRoutes(protectedRoutes, dbConfig)
		api.RegisterCommentRoutes(protectedRoutes, dbConfig)
		api.RegisterPostRoutes(protectedRoutes, dbConfig)
	}
}
