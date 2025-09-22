package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// Todo represents a todo item
type Todo struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Completed   bool      `json:"completed"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CreateTodoRequest represents the request body for creating a todo
type CreateTodoRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Completed   bool   `json:"completed"`
}

// UpdateTodoRequest represents the request body for updating a todo
type UpdateTodoRequest struct {
	Title       *string `json:"title,omitempty"`
	Description *string `json:"description,omitempty"`
	Completed   *bool   `json:"completed,omitempty"`
}

// TodosResponse represents the response for listing todos
type TodosResponse struct {
	Todos  []Todo `json:"todos"`
	Total  int    `json:"total"`
	Limit  int    `json:"limit"`
	Offset int    `json:"offset"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error   string      `json:"error"`
	Message string      `json:"message"`
	Details interface{} `json:"details,omitempty"`
}

// In-memory storage (in production, this would be a database)
var todos = make(map[string]*Todo)

func main() {
	// Create some sample todos
	sampleTodo1 := &Todo{
		ID:          uuid.New().String(),
		Title:       "Learn Go",
		Description: "Complete the Go tutorial and build a sample API",
		Completed:   false,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	sampleTodo2 := &Todo{
		ID:          uuid.New().String(),
		Title:       "Build React App",
		Description: "Create a React frontend for the todo application",
		Completed:   false,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	todos[sampleTodo1.ID] = sampleTodo1
	todos[sampleTodo2.ID] = sampleTodo2

	router := mux.NewRouter()

	// API routes
	api := router.PathPrefix("/api").Subrouter()
	api.HandleFunc("/todos", listTodos).Methods("GET")
	api.HandleFunc("/todos", createTodo).Methods("POST")
	api.HandleFunc("/todos/{id}", getTodo).Methods("GET")
	api.HandleFunc("/todos/{id}", updateTodo).Methods("PUT")
	api.HandleFunc("/todos/{id}", deleteTodo).Methods("DELETE")

	// Health check
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	}).Methods("GET")

	// CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000", "http://localhost:5173"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	handler := c.Handler(router)

	port := "8080"
	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func listTodos(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Parse query parameters
	query := r.URL.Query()
	
	// Limit parameter
	limit := 20
	if l := query.Get("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 && parsed <= 100 {
			limit = parsed
		}
	}

	// Offset parameter
	offset := 0
	if o := query.Get("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil && parsed >= 0 {
			offset = parsed
		}
	}

	// Completed filter
	var completedFilter *bool
	if c := query.Get("completed"); c != "" {
		if parsed, err := strconv.ParseBool(c); err == nil {
			completedFilter = &parsed
		}
	}

	// Convert map to slice and apply filters
	var todoList []Todo
	for _, todo := range todos {
		// Apply completed filter
		if completedFilter != nil && todo.Completed != *completedFilter {
			continue
		}
		todoList = append(todoList, *todo)
	}

	total := len(todoList)

	// Apply pagination
	start := offset
	end := offset + limit
	if start > total {
		start = total
	}
	if end > total {
		end = total
	}

	paginatedTodos := make([]Todo, 0)
	if start < total {
		paginatedTodos = todoList[start:end]
	}

	response := TodosResponse{
		Todos:  paginatedTodos,
		Total:  total,
		Limit:  limit,
		Offset: offset,
	}

	json.NewEncoder(w).Encode(response)
}

func createTodo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req CreateTodoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error:   "INVALID_JSON",
			Message: "Invalid JSON in request body",
		})
		return
	}

	// Validate required fields
	if req.Title == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error:   "VALIDATION_ERROR",
			Message: "Title is required",
		})
		return
	}

	// Create new todo
	todo := &Todo{
		ID:          uuid.New().String(),
		Title:       req.Title,
		Description: req.Description,
		Completed:   req.Completed,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	todos[todo.ID] = todo

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(todo)
}

func getTodo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	id := vars["id"]

	todo, exists := todos[id]
	if !exists {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error:   "NOT_FOUND",
			Message: "Todo not found",
		})
		return
	}

	json.NewEncoder(w).Encode(todo)
}

func updateTodo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	id := vars["id"]

	todo, exists := todos[id]
	if !exists {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error:   "NOT_FOUND",
			Message: "Todo not found",
		})
		return
	}

	var req UpdateTodoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error:   "INVALID_JSON",
			Message: "Invalid JSON in request body",
		})
		return
	}

	// Update fields if provided
	if req.Title != nil {
		if *req.Title == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(ErrorResponse{
				Error:   "VALIDATION_ERROR",
				Message: "Title cannot be empty",
			})
			return
		}
		todo.Title = *req.Title
	}
	if req.Description != nil {
		todo.Description = *req.Description
	}
	if req.Completed != nil {
		todo.Completed = *req.Completed
	}

	todo.UpdatedAt = time.Now()
	todos[id] = todo

	json.NewEncoder(w).Encode(todo)
}

func deleteTodo(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	_, exists := todos[id]
	if !exists {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(ErrorResponse{
			Error:   "NOT_FOUND",
			Message: "Todo not found",
		})
		return
	}

	delete(todos, id)
	w.WriteHeader(http.StatusNoContent)
}