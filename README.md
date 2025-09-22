# Todo App - Full Stack Monorepo

A modern, production-ready todo application built with React, Go, and deployed on AWS using Terraform. This project demonstrates best practices for full-stack development with OpenAPI-driven development, containerization, and infrastructure as code.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Go Backend    │    │   PostgreSQL    │
│   (Frontend)    │◄──►│   (API)         │◄──►│   (Database)    │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Terraform     │
                    │   (AWS Infra)   │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** - For containerized development
- **Node.js 18+** - For frontend development
- **Go 1.21+** - For backend development
- **AWS CLI** - For infrastructure deployment (optional)
- **Terraform** - For infrastructure management (optional)

### Development Setup

1. **Clone and setup**:

   ```bash
   git clone <repository-url>
   cd prtest2
   make setup
   ```

2. **Start development environment**:

   ```bash
   make dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/api/v1/health

### Alternative: Manual Setup

If you prefer to run services individually:

```bash
# Start database
docker-compose up -d postgres

# Run backend (in terminal 1)
cd backend
go run main.go

# Run frontend (in terminal 2)
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
prtest2/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── api/            # API client functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main application component
│   ├── package.json
│   └── Dockerfile
├── backend/                 # Go backend API
│   ├── handlers/           # HTTP request handlers
│   ├── services/           # Business logic
│   ├── models/             # Database models
│   ├── database/           # Database connection
│   ├── main.go             # Application entry point
│   └── Dockerfile
├── infra/                  # Terraform infrastructure
│   ├── main.tf            # Main Terraform configuration
│   ├── networking.tf      # VPC and networking
│   ├── database.tf        # RDS configuration
│   ├── ecs.tf             # ECS and ECR setup
│   └── alb.tf             # Load balancer configuration
├── notes/                  # Design documentation
│   ├── design.md          # Architecture and design notes
│   └── api-spec.yaml      # OpenAPI specification
├── docker-compose.yml      # Production containers
├── docker-compose.dev.yml  # Development containers
└── Makefile               # Development commands
```

## 🛠️ Available Commands

### Development Commands

```bash
make dev              # Start development environment
make dev-down         # Stop development environment
make setup            # Initial development setup
make clean            # Clean up build artifacts
```

### Backend Commands

```bash
make backend-dev      # Run backend in development mode
make backend-build    # Build backend binary
make backend-test     # Run backend tests
make backend-generate # Generate OpenAPI code
```

### Frontend Commands

```bash
make frontend-dev     # Run frontend development server
make frontend-build   # Build frontend for production
make frontend-test    # Run frontend tests
make frontend-lint    # Lint frontend code
```

### Infrastructure Commands

```bash
make infra-init       # Initialize Terraform
make infra-plan       # Plan infrastructure changes
make infra-apply      # Deploy infrastructure
make infra-destroy    # Destroy infrastructure
```

### Utility Commands

```bash
make logs             # Show all application logs
make logs-backend     # Show backend logs only
make logs-frontend    # Show frontend logs only
make test             # Run all tests
make lint             # Run all linters
```

## 🔧 Technology Stack

### Frontend

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Mantine** - Modern, accessible UI component library
- **React Query** - Server state management
- **Mantine Form** - Form handling and validation
- **Mantine Notifications** - User feedback system
- **Tabler Icons** - Consistent iconography
- **Axios** - HTTP client
- **Vite** - Fast build tool

### Backend

- **Go 1.21** - High-performance server language
- **Gin** - HTTP web framework
- **GORM** - Object-relational mapping
- **PostgreSQL** - Relational database
- **OpenAPI** - API specification and code generation

### Infrastructure

- **Terraform** - Infrastructure as code
- **AWS** - Cloud provider
- **ECS Fargate** - Container orchestration
- **RDS PostgreSQL** - Managed database
- **Application Load Balancer** - Traffic routing
- **ECR** - Container registry

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Make** - Build automation

## 📚 API Documentation

The API is built around the OpenAPI 3.0 specification located in `notes/api-spec.yaml`. Key endpoints:

- `GET /api/v1/todos` - List all todos
- `POST /api/v1/todos` - Create a new todo
- `GET /api/v1/todos/{id}` - Get specific todo
- `PUT /api/v1/todos/{id}` - Update todo
- `DELETE /api/v1/todos/{id}` - Delete todo
- `PATCH /api/v1/todos/{id}/complete` - Toggle completion

## 🚀 Deployment

### Local Production Build

```bash
make build
make up
```

### AWS Deployment

```bash
# Configure AWS credentials
aws configure

# Initialize and deploy infrastructure
make infra-init
make infra-apply

# Build and push container images
# (See infra/README.md for detailed instructions)
```

## 🧪 Testing

### Backend Tests

```bash
make backend-test
```

### Frontend Tests

```bash
make frontend-test
```

### Integration Tests

```bash
# Start test environment
docker-compose -f docker-compose.test.yml up --build

# Run integration tests
npm run test:integration
```

## 🔍 Monitoring and Logging

### Local Development

- Backend logs: `make logs-backend`
- Frontend logs: `make logs-frontend`
- All logs: `make logs`

### Production (AWS)

- CloudWatch Logs for application logs
- ECS service monitoring
- Load balancer health checks
- RDS performance insights

## 🛡️ Security Features

- **Input validation** - All inputs are validated
- **SQL injection prevention** - Using GORM ORM
- **CORS configuration** - Proper cross-origin setup
- **Environment variables** - Sensitive data protection
- **Container security** - Non-root containers
- **Network isolation** - Private subnets for database

## 📈 Performance Optimizations

- **React Query caching** - Efficient API state management
- **Container optimization** - Multi-stage Docker builds
- **Database indexing** - Optimized queries
- **Static asset caching** - CDN-ready frontend
- **Connection pooling** - Database connection management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`make test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 Development Guidelines

### Code Style

- **Backend**: Follow Go conventions, use `gofmt`
- **Frontend**: Use Prettier and ESLint
- **Infrastructure**: Follow Terraform best practices

### Git Workflow

- Use conventional commits
- Keep commits atomic
- Write descriptive commit messages
- Update documentation for new features

### Testing

- Write unit tests for new features
- Include integration tests for API endpoints
- Test error scenarios and edge cases

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Database connection issues**:

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Reset database
make db-reset
```

**Frontend build issues**:

```bash
# Clear node modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Backend compilation issues**:

```bash
# Clean and rebuild
cd backend
go clean -cache
go mod tidy
go run main.go
```

**Docker issues**:

```bash
# Clean Docker system
make clean
docker system prune -f
```

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check the troubleshooting section above
- Review the design notes in `notes/design.md`

---

**Happy coding! 🎉**
