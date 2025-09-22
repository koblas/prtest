# Todo App Monorepo

A complete full-stack todo application built with modern technologies and infrastructure as code.

![Todo App Screenshot](https://github.com/user-attachments/assets/0dd0c771-3424-4df2-8911-fd70501c61dc)

## 🏗️ Architecture

This monorepo contains a full-stack application with:

- **Frontend**: React + TypeScript + Material-UI
- **Backend**: Go REST API with OpenAPI specification
- **Infrastructure**: Terraform for AWS deployment
- **Documentation**: Comprehensive design notes and setup guides

## 📁 Project Structure

```
├── backend/           # Go REST API server
│   ├── main.go       # Main server implementation
│   ├── go.mod        # Go module definition
│   └── README.md     # Backend documentation
├── frontend/         # React TypeScript application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API client services
│   │   └── types/       # TypeScript type definitions
│   ├── package.json  # Frontend dependencies
│   └── README.md     # Frontend documentation
├── infra/            # Terraform infrastructure
│   ├── *.tf         # Terraform configuration files
│   └── README.md    # Infrastructure documentation
├── notes/            # Design documentation
│   └── design.md    # Project design notes
├── openapi.yaml     # API specification
└── README.md        # This file
```

## 🚀 Quick Start

### Prerequisites

- [Go](https://golang.org/) 1.19+ for backend
- [Node.js](https://nodejs.org/) 18+ for frontend
- [Terraform](https://terraform.io/) 1.0+ for infrastructure (optional)

### Running Locally

1. **Start the Backend API**:
   ```bash
   cd backend
   go mod tidy
   go run main.go
   ```
   The API will be available at `http://localhost:8080`

2. **Start the Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The app will open at `http://localhost:3000`

3. **View the API Documentation**:
   The OpenAPI specification is available in `openapi.yaml`

## 🔧 Development

### API Contract

The application follows an API-first approach with OpenAPI 3.0 specification:

- **Backend** implements the API according to the spec
- **Frontend** generates TypeScript types from the spec
- **Infrastructure** provisions the required resources

### Key Features

- ✅ **Create, read, update, delete todos**
- ✅ **Mark todos as completed/pending**
- ✅ **Filter todos by completion status**
- ✅ **Pagination for large lists**
- ✅ **Responsive Material-UI design**
- ✅ **Type-safe API client**
- ✅ **Real-time updates**
- ✅ **Error handling and loading states**

### API Endpoints

- `GET /api/todos` - List todos with filtering and pagination
- `POST /api/todos` - Create a new todo
- `GET /api/todos/{id}` - Get a specific todo
- `PUT /api/todos/{id}` - Update a todo
- `DELETE /api/todos/{id}` - Delete a todo
- `GET /health` - Health check

## 🏭 Production Deployment

### Infrastructure

The `infra/` directory contains Terraform configurations for AWS deployment:

- **VPC** with public/private subnets
- **Application Load Balancer** for traffic distribution
- **ECS Fargate** for containerized services
- **CloudWatch** for logging and monitoring

### Deploy to AWS

```bash
cd infra
terraform init
terraform plan
terraform apply
```

See `infra/README.md` for detailed deployment instructions.

## 📚 Documentation

- [`backend/README.md`](backend/README.md) - Backend API documentation
- [`frontend/README.md`](frontend/README.md) - Frontend development guide
- [`infra/README.md`](infra/README.md) - Infrastructure deployment guide
- [`notes/design.md`](notes/design.md) - Project design decisions and architecture

## 🧪 Testing

### Backend Testing
```bash
cd backend
# Test API endpoints
curl http://localhost:8080/api/todos
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","description":"Test description"}'
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🛠️ Technology Stack

### Backend
- **Go** - Fast, statically typed language
- **Gorilla Mux** - HTTP router and URL matcher
- **UUID** - Unique identifier generation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type safety and better DX
- **Material-UI** - Google's Material Design components
- **Axios** - HTTP client for API calls

### Infrastructure
- **Terraform** - Infrastructure as Code
- **AWS ECS Fargate** - Serverless containers
- **Application Load Balancer** - Traffic distribution
- **CloudWatch** - Monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
