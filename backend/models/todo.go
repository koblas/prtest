package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Todo struct {
	ID          uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Title       string         `json:"title" gorm:"size:255;not null"`
	Description string         `json:"description" gorm:"size:1000"`
	Completed   bool           `json:"completed" gorm:"default:false"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName returns the table name for the Todo model
func (Todo) TableName() string {
	return "todos"
}

// BeforeCreate hook to generate UUID if not set
func (t *Todo) BeforeCreate(tx *gorm.DB) error {
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	return nil
}
