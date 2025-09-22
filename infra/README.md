# Terraform Infrastructure

Infrastructure as Code for the Todo application using AWS services.

## Architecture

The infrastructure deploys a containerized application on AWS with the following components:

- **VPC** with public and private subnets across 2 AZs
- **Application Load Balancer** for traffic distribution
- **ECS Fargate** for container orchestration
- **CloudWatch** for logging and monitoring
- **Security Groups** for network access control

## Components

### Networking
- VPC with CIDR 10.0.0.0/16
- 2 public subnets for load balancer
- 2 private subnets for ECS tasks
- Internet Gateway and NAT Gateways for internet access

### Compute
- ECS Fargate cluster for serverless containers
- Separate services for frontend and backend
- Auto-scaling capabilities
- Load balancer health checks

### Security
- Security groups with minimal required access
- ECS tasks in private subnets
- IAM roles with least privilege

## Files

- `main.tf` - Provider configuration
- `variables.tf` - Input variables
- `outputs.tf` - Output values
- `vpc.tf` - VPC and networking resources
- `security_groups.tf` - Security group definitions
- `load_balancer.tf` - ALB and target groups
- `ecs.tf` - ECS cluster, services, and task definitions

## Usage

### Prerequisites
1. AWS CLI configured with appropriate credentials
2. Terraform installed (>= 1.0)

### Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the infrastructure
terraform apply

# View outputs
terraform output
```

### Variables

Key variables you can customize:

```bash
# terraform.tfvars
aws_region = "us-east-1"
environment = "dev"
app_name = "todo-app"
desired_count = 2
```

### Environments

Create separate `.tfvars` files for different environments:

- `dev.tfvars` - Development environment
- `staging.tfvars` - Staging environment  
- `prod.tfvars` - Production environment

Deploy with:
```bash
terraform apply -var-file="dev.tfvars"
```

### Container Images

Update the `backend_image` and `frontend_image` variables to point to your actual container images:

```bash
terraform apply -var="backend_image=your-registry/todo-backend:latest" -var="frontend_image=your-registry/todo-frontend:latest"
```

## Outputs

After deployment, Terraform will output:
- Load balancer hostname
- Backend API URL
- Frontend URL
- VPC ID
- ECS cluster name

## Clean Up

```bash
terraform destroy
```

## Security Considerations

- ECS tasks run in private subnets
- Only ALB has public access
- Security groups follow least privilege
- Consider adding:
  - SSL/TLS termination at ALB
  - WAF for additional protection
  - VPC endpoints for AWS services
  - Database encryption
  - Secrets management