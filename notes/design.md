# Todo App Design Notes

## Project Overview

A modern todo application built as a monorepo with:

- **Frontend**: React with TypeScript, modern UI components
- **Backend**: Go with Gin framework, OpenAPI integration
- **Infrastructure**: Terraform for AWS deployment
- **API**: OpenAPI 3.0 specification-driven development

## Architecture

### Frontend (React)

- **Framework**: React 18 with TypeScript
- **UI Library**: Mantine for modern, accessible components
- **State Management**: React Query for server state, Zustand for client state
- **Form Handling**: Mantine Form for validation and form management
- **Notifications**: Mantine Notifications for user feedback
- **Icons**: Tabler Icons for consistent iconography
- **Build Tool**: Vite for fast development and optimized builds

### Backend (Go)

- **Framework**: Gin for HTTP routing
- **API Generation**: oapi-codegen for OpenAPI integration
- **Database**: PostgreSQL with GORM ORM
- **Authentication**: JWT tokens
- **Validation**: go-playground/validator
- **Testing**: Testify for unit tests

### Infrastructure (Terraform)

- **Cloud Provider**: AWS
- **Compute**: ECS Fargate for containerized deployment
- **Database**: RDS PostgreSQL
- **Load Balancer**: Application Load Balancer
- **Networking**: VPC with public/private subnets
- **Storage**: S3 for static assets

## API Design

### Core Endpoints

- `GET /todos` - List all todos
- `POST /todos` - Create a new todo
- `GET /todos/{id}` - Get specific todo
- `PUT /todos/{id}` - Update todo
- `DELETE /todos/{id}` - Delete todo
- `PATCH /todos/{id}/complete` - Mark todo as complete/incomplete

### Data Models

- **Todo**: id, title, description, completed, created_at, updated_at
- **User**: id, email, name, created_at (for future auth)

## Development Workflow

1. OpenAPI spec defines the contract
2. Backend generates code from spec
3. Frontend generates TypeScript types from spec
4. Both sides stay in sync automatically

## Deployment Strategy

- Docker containers for both frontend and backend
- Terraform manages AWS infrastructure
- CI/CD pipeline for automated deployment
- Environment-specific configurations (dev/staging/prod)
