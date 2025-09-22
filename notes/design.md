# Design Notes

## Project Overview

This is a monorepo project with the following structure:
- `frontend/` - React-based frontend application
- `backend/` - Go-based backend API
- `infra/` - Terraform infrastructure as code
- `notes/` - Design documentation and notes

## Architecture

### Backend (Go)
- RESTful API following OpenAPI 3.0 specification
- Todo application as sample implementation
- Standard Go project layout
- JSON API endpoints for CRUD operations

### Frontend (React)
- Modern React application with TypeScript
- OpenAPI client generation for type-safe API calls
- Material-UI or similar component library
- Responsive design for todo management

### Infrastructure (Terraform)
- Cloud-agnostic infrastructure definitions
- Container deployment ready
- Environment separation (dev, staging, prod)

## Todo App Specification

### API Endpoints
- `GET /api/todos` - List all todos
- `POST /api/todos` - Create a new todo
- `GET /api/todos/{id}` - Get a specific todo
- `PUT /api/todos/{id}` - Update a todo
- `DELETE /api/todos/{id}` - Delete a todo

### Data Model
```json
{
  "id": "string (uuid)",
  "title": "string",
  "description": "string",
  "completed": "boolean",
  "created_at": "string (ISO 8601)",
  "updated_at": "string (ISO 8601)"
}
```

## Development Workflow
1. OpenAPI spec serves as contract between frontend and backend
2. Backend implements the API according to spec
3. Frontend generates client from OpenAPI spec
4. Infrastructure provisions required resources