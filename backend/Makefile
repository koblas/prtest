.PHONY: generate build run test clean

# Generate OpenAPI code
generate:
	oapi-codegen -generate types -o types.go ../notes/api-spec.yaml
	oapi-codegen -generate gin -o handlers.go ../notes/api-spec.yaml

# Build the application
build:
	go build -o bin/todo-backend main.go

# Run the application
run:
	go run main.go

# Run tests
test:
	go test ./...

# Clean build artifacts
clean:
	rm -rf bin/
	rm -f types.go handlers.go

# Install dependencies
deps:
	go mod tidy
	go mod download

# Run with hot reload (requires air)
dev:
	air

# Setup development environment
setup: deps
	@echo "Setting up development environment..."
	@echo "Make sure PostgreSQL is running on localhost:5432"
	@echo "Create a database named 'todos'"
	@echo "Update .env file with your database credentials"
