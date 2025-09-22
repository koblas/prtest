# Go Backend

A RESTful API server for the Todo application built with Go.

## Features

- RESTful API following OpenAPI 3.0 specification
- In-memory storage for todos (can be easily replaced with a database)
- CORS support for frontend integration
- Input validation and error handling
- UUID-based todo IDs

## API Endpoints

- `GET /api/todos` - List all todos with pagination and filtering
- `POST /api/todos` - Create a new todo
- `GET /api/todos/{id}` - Get a specific todo
- `PUT /api/todos/{id}` - Update a todo
- `DELETE /api/todos/{id}` - Delete a todo
- `GET /health` - Health check endpoint

## Running the Server

```bash
go run main.go
```

The server will start on port 8080.

## Dependencies

- `github.com/gorilla/mux` - HTTP router
- `github.com/google/uuid` - UUID generation
- `github.com/rs/cors` - CORS middleware

## Development

1. Install dependencies: `go mod tidy`
2. Run the server: `go run main.go`
3. Test the API endpoints using curl or a REST client

Example:
```bash
# Create a todo
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","description":"This is a test"}'

# List todos
curl http://localhost:8080/api/todos
```