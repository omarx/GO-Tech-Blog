package utils

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"net/http"
)

func WithAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		userID := session.Get("user_id")

		// If user_id is not in session, redirect to login
		if userID == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized. Please log in."})
			c.Abort()
			return
		}

		// If user_id exists, proceed to the next handler
		c.Next()
	}
}
