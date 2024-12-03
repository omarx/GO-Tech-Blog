package models

import "gorm.io/gorm"

type Post struct {
	gorm.Model
	Title    string    `gorm:"not null"`
	Body     string    `gorm:"type:text;not null"`
	UserID   uint      `gorm:"not null"`
	User     User      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Comments []Comment `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
