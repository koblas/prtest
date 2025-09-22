.PHONY: help dev build up down clean test lint format

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development commands
dev: ## Start development environment
	docker-compose -f docker-compose.dev.yml up --build

dev-down: ## Stop development environment
	docker-compose -f docker-compose.dev.yml down

# Production commands
build: ## Build production images
	cd frontend && npm run build
	docker-compose build

up: ## Start production environment
	docker-compose up -d

down: ## Stop production environment
	docker-compose down

# Backend commands
backend-dev: ## Run backend in development mode
	cd backend && go run main.go

backend-build: ## Build backend
	cd backend && go build -o bin/todo-backend main.go

backend-test: ## Run backend tests
	cd backend && go test ./...

backend-lint: ## Lint backend code
	cd backend && golangci-lint run

backend-generate: ## Generate OpenAPI code for backend
	cd backend && make generate

# Frontend commands
frontend-dev: ## Run frontend in development mode
	cd frontend && npm run dev

frontend-build: ## Build frontend
	cd frontend && npm run build

frontend-test: ## Run frontend tests
	cd frontend && npm test

frontend-lint: ## Lint frontend code
	cd frontend && npm run lint

frontend-install: ## Install frontend dependencies
	cd frontend && npm install

# Infrastructure commands
infra-init: ## Initialize Terraform
	cd infra && terraform init

infra-plan: ## Plan Terraform deployment
	cd infra && terraform plan

infra-apply: ## Apply Terraform configuration
	cd infra && terraform apply

infra-destroy: ## Destroy Terraform infrastructure
	cd infra && terraform destroy

# Database commands
db-migrate: ## Run database migrations
	cd backend && go run main.go migrate

db-reset: ## Reset database (WARNING: This will delete all data)
	docker-compose down -v
	docker-compose up -d postgres
	sleep 5
	docker-compose up -d backend

# Utility commands
clean: ## Clean up build artifacts and containers
	docker-compose down -v
	docker system prune -f
	cd backend && rm -rf bin/ tmp/
	cd frontend && rm -rf dist/

clean-build: ## Clean only build artifacts (keep containers)
	cd backend && rm -rf bin/ tmp/
	cd frontend && rm -rf dist/

logs: ## Show application logs
	docker-compose logs -f

logs-backend: ## Show backend logs
	docker-compose logs -f backend

logs-frontend: ## Show frontend logs
	docker-compose logs -f frontend

# Setup commands
setup: ## Initial setup for development
	@echo "Setting up development environment..."
	@echo "1. Installing backend dependencies..."
	cd backend && go mod tidy
	@echo "2. Installing frontend dependencies..."
	cd frontend && npm install
	@echo "3. Setting up database..."
	docker-compose up -d postgres
	@echo "Setup complete! Run 'make dev' to start development."

# Test commands
test: ## Run all tests
	cd backend && go test ./...
	cd frontend && npm test

lint: ## Run all linters
	cd backend && golangci-lint run
	cd frontend && npm run lint

format: ## Format all code
	cd backend && go fmt ./...
	cd frontend && npm run lint -- --fix
