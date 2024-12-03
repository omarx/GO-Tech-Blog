package connect

import (
	"TechBlog/models"
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DBConfig holds the database connection
type DBConfig struct {
	DB *gorm.DB
}

// DBConnect initializes the database connection and migrates models
func DBConnect(user string, pass string, dbname string) (*DBConfig, error) {
	dsn := fmt.Sprintf(
		"host=localhost user=%s password=%s dbname=%s port=5432 sslmode=disable",
		user, pass, dbname,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to the database: %w", err)
	}

	err = db.AutoMigrate(
		&models.User{},
		&models.Post{},
		&models.Comment{},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to migrate database: %w", err)
	}

	return &DBConfig{DB: db}, nil
}
