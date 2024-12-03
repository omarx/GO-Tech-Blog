package models

import "gorm.io/gorm"

type Comment struct {
	gorm.Model
	Body   string `gorm:"not null"`
	PostID uint   `gorm:"not null"`
	Post   Post   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	UserID uint   `gorm:"not null"`
	User   User   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
