# Deployment Guide

This guide covers different deployment scenarios for the Todo App, from local development to production on AWS.

## 🏠 Local Development

### Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd prtest2
make setup

# Start development environment
make dev
```

### Manual Setup

```bash
# Start database
docker-compose up -d postgres

# Backend (Terminal 1)
cd backend
go run main.go

# Frontend (Terminal 2)
cd frontend
npm install
npm run dev
```

## 🐳 Docker Deployment

### Development Environment

```bash
# Start all services with hot reload
make dev

# Or manually
docker-compose -f docker-compose.dev.yml up --build
```

### Production Environment

```bash
# Build and start production containers
make build
make up

# Or manually
docker-compose up --build -d
```

### Access Points

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Database: localhost:5432

## ☁️ AWS Production Deployment

### Prerequisites

1. AWS CLI configured with appropriate permissions
2. Terraform >= 1.0 installed
3. Docker for building images

### Step 1: Configure Infrastructure

```bash
cd infra

# Copy and edit configuration
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Deploy infrastructure
terraform apply
```

### Step 2: Build and Push Container Images

```bash
# Get ECR repository URL
ECR_URL=$(terraform output -raw ecr_repository_url)

# Login to ECR
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin $ECR_URL

# Build and tag backend image
cd ../backend
docker build -t todo-backend .
docker tag todo-backend:latest $ECR_URL:latest

# Push image
docker push $ECR_URL:latest
```

### Step 3: Update ECS Service

```bash
# Force new deployment to use latest image
aws ecs update-service \
  --cluster todo-app-cluster \
  --service todo-app-service \
  --force-new-deployment
```

### Step 4: Access Application

```bash
# Get application URL
terraform output frontend_url
```

## 🔧 Environment Configuration

### Development (.env)

```env
# Backend
DB_HOST=localhost
DB_PORT=5432
DB_USER=todos
DB_PASSWORD=password
DB_NAME=todos
DB_SSLMODE=disable
PORT=8080
GIN_MODE=debug

# Frontend
VITE_API_URL=http://localhost:8080
```

### Production (ECS Task Definition)

```json
{
  "environment": [
    { "name": "GIN_MODE", "value": "release" },
    { "name": "PORT", "value": "8080" },
    { "name": "DB_HOST", "value": "your-rds-endpoint" },
    { "name": "DB_PORT", "value": "5432" },
    { "name": "DB_USER", "value": "todos" },
    { "name": "DB_NAME", "value": "todos" },
    { "name": "DB_SSLMODE", "value": "require" }
  ],
  "secrets": [
    {
      "name": "DB_PASSWORD",
      "valueFrom": "arn:aws:secretsmanager:region:account:secret:todo-app-db-password"
    }
  ]
}
```

## 📊 Monitoring and Logs

### Local Development

```bash
# View all logs
make logs

# View specific service logs
make logs-backend
make logs-frontend

# Follow logs in real-time
docker-compose logs -f backend
```

### AWS Production

```bash
# View ECS service logs
aws logs tail /ecs/todo-app --follow

# Check ECS service status
aws ecs describe-services \
  --cluster todo-app-cluster \
  --services todo-app-service

# View RDS logs
aws rds describe-db-log-files \
  --db-instance-identifier todo-app-db
```

## 🔄 CI/CD Pipeline Setup

### GitHub Actions Example

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2

      - name: Build and push Docker image
        run: |
          ECR_URL=$(terraform output -raw ecr_repository_url)
          aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URL
          docker build -t $ECR_URL:$GITHUB_SHA ./backend
          docker push $ECR_URL:$GITHUB_SHA

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster todo-app-cluster \
            --service todo-app-service \
            --force-new-deployment
```

## 🛡️ Security Considerations

### Database Security

- Use strong passwords
- Enable SSL connections in production
- Restrict database access to application subnets only
- Regular security updates

### Application Security

- Use environment variables for secrets
- Enable HTTPS in production
- Implement rate limiting
- Regular dependency updates

### Infrastructure Security

- Use private subnets for databases
- Implement proper IAM roles
- Enable VPC flow logs
- Regular security audits

## 🔍 Troubleshooting

### Common Deployment Issues

**Database Connection Errors**:

```bash
# Check database status
docker-compose ps postgres
aws rds describe-db-instances --db-instance-identifier todo-app-db

# Test connection
psql -h localhost -U todos -d todos
```

**ECS Service Not Starting**:

```bash
# Check task definition
aws ecs describe-task-definition --task-definition todo-app

# Check service events
aws ecs describe-services \
  --cluster todo-app-cluster \
  --services todo-app-service
```

**Load Balancer Health Check Failures**:

```bash
# Check target group health
aws elbv2 describe-target-health \
  --target-group-arn $(terraform output -raw target_group_arn)
```

### Performance Issues

**Slow Database Queries**:

- Check query execution plans
- Add appropriate indexes
- Monitor RDS performance insights

**High Memory Usage**:

- Monitor container resource usage
- Adjust ECS task memory allocation
- Optimize application code

## 📈 Scaling

### Horizontal Scaling

```bash
# Scale ECS service
aws ecs update-service \
  --cluster todo-app-cluster \
  --service todo-app-service \
  --desired-count 3
```

### Database Scaling

- Use read replicas for read-heavy workloads
- Consider Aurora Serverless for variable workloads
- Implement connection pooling

### Load Balancer Configuration

- Configure auto-scaling groups
- Set up health checks
- Implement sticky sessions if needed

## 🔄 Backup and Recovery

### Database Backups

- Automated daily backups (7-day retention)
- Point-in-time recovery enabled
- Cross-region backup replication

### Application Data

- Regular container image backups
- Infrastructure state backups
- Configuration management

### Disaster Recovery

- Multi-AZ deployment
- Cross-region replication
- Automated failover procedures

## 📝 Maintenance

### Regular Tasks

- Update dependencies monthly
- Review security patches
- Monitor resource usage
- Clean up old container images

### Updates

- Blue-green deployments for zero downtime
- Database migration strategies
- Rollback procedures

This deployment guide provides comprehensive coverage for deploying the Todo App in various environments. Choose the approach that best fits your needs and infrastructure requirements.
