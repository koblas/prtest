package services

import (
	"errors"
	"time"

	"todo-backend/database"
	"todo-backend/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TodoService struct{}

// NewTodoService creates a new todo service
func NewTodoService() *TodoService {
	return &TodoService{}
}

// CreateTodo creates a new todo
func (s *TodoService) CreateTodo(req CreateTodoRequest) (*models.Todo, error) {
	todo := &models.Todo{
		Title:       req.Title,
		Description: req.Description,
		Completed:   false,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if err := database.DB.Create(todo).Error; err != nil {
		return nil, err
	}

	return todo, nil
}

// GetTodos retrieves todos with optional filtering and pagination
func (s *TodoService) GetTodos(completed *bool, limit, offset int) ([]models.Todo, int64, error) {
	var todos []models.Todo
	var total int64

	query := database.DB.Model(&models.Todo{})

	// Apply completion filter if provided
	if completed != nil {
		query = query.Where("completed = ?", *completed)
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Apply pagination and get results
	if err := query.Limit(limit).Offset(offset).Order("created_at DESC").Find(&todos).Error; err != nil {
		return nil, 0, err
	}

	return todos, total, nil
}

// GetTodoByID retrieves a todo by ID
func (s *TodoService) GetTodoByID(id uuid.UUID) (*models.Todo, error) {
	var todo models.Todo
	if err := database.DB.First(&todo, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("todo not found")
		}
		return nil, err
	}
	return &todo, nil
}

// UpdateTodo updates an existing todo
func (s *TodoService) UpdateTodo(id uuid.UUID, req UpdateTodoRequest) (*models.Todo, error) {
	todo, err := s.GetTodoByID(id)
	if err != nil {
		return nil, err
	}

	// Update fields if provided
	if req.Title != nil {
		todo.Title = *req.Title
	}
	if req.Description != nil {
		todo.Description = *req.Description
	}
	if req.Completed != nil {
		todo.Completed = *req.Completed
	}

	todo.UpdatedAt = time.Now()

	if err := database.DB.Save(todo).Error; err != nil {
		return nil, err
	}

	return todo, nil
}

// DeleteTodo deletes a todo by ID
func (s *TodoService) DeleteTodo(id uuid.UUID) error {
	if err := database.DB.Delete(&models.Todo{}, "id = ?", id).Error; err != nil {
		return err
	}
	return nil
}

// ToggleTodoCompletion toggles the completion status of a todo
func (s *TodoService) ToggleTodoCompletion(id uuid.UUID, completed bool) (*models.Todo, error) {
	todo, err := s.GetTodoByID(id)
	if err != nil {
		return nil, err
	}

	todo.Completed = completed
	todo.UpdatedAt = time.Now()

	if err := database.DB.Save(todo).Error; err != nil {
		return nil, err
	}

	return todo, nil
}

// Request/Response types
type CreateTodoRequest struct {
	Title       string `json:"title" binding:"required,min=1,max=255"`
	Description string `json:"description,omitempty" binding:"max=1000"`
}

type UpdateTodoRequest struct {
	Title       *string `json:"title,omitempty" binding:"omitempty,min=1,max=255"`
	Description *string `json:"description,omitempty" binding:"omitempty,max=1000"`
	Completed   *bool   `json:"completed,omitempty"`
}

type TodoListResponse struct {
	Todos  []models.Todo `json:"todos"`
	Total  int64         `json:"total"`
	Limit  int           `json:"limit"`
	Offset int           `json:"offset"`
}

