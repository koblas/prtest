# Infrastructure as Code

This directory contains Terraform configurations for deploying the Todo App to AWS.

## Architecture

The infrastructure includes:

- **VPC**: Virtual Private Cloud with public and private subnets
- **RDS PostgreSQL**: Managed database for storing todo data
- **ECS Fargate**: Containerized application hosting
- **Application Load Balancer**: Traffic routing and SSL termination
- **ECR**: Container registry for Docker images
- **CloudWatch**: Logging and monitoring
- **Secrets Manager**: Secure storage for database credentials

## Prerequisites

1. **AWS CLI** configured with appropriate credentials
2. **Terraform** >= 1.0 installed
3. **Docker** for building container images

## Quick Start

1. **Copy and configure variables**:

   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values
   ```

2. **Initialize Terraform**:

   ```bash
   terraform init
   ```

3. **Plan the deployment**:

   ```bash
   terraform plan
   ```

4. **Deploy the infrastructure**:

   ```bash
   terraform apply
   ```

5. **Get the application URL**:
   ```bash
   terraform output frontend_url
   ```

## Environment Configuration

### Development Environment

- Uses minimal resources (db.t3.micro, 256 CPU units)
- Single availability zone
- No NAT Gateway (cost optimization)
- Deletion protection disabled

### Production Environment

- Larger instance sizes
- Multi-AZ deployment
- NAT Gateway for private subnet internet access
- Deletion protection enabled
- Automated backups

## Security Features

- Database in private subnets only
- Security groups with minimal required access
- Secrets Manager for sensitive data
- Encrypted storage
- HTTPS ready (SSL certificate can be added)

## Cost Optimization

- Development environment uses minimal resources
- NAT Gateway only in production
- Spot instances for non-critical workloads
- Automatic scaling based on demand

## Monitoring and Logging

- CloudWatch logs for application and infrastructure
- Health checks on load balancer
- Container insights enabled
- Custom metrics support

## Cleanup

To destroy the infrastructure:

```bash
terraform destroy
```

**Warning**: This will delete all resources and data. Make sure to backup any important data first.

## Troubleshooting

### Common Issues

1. **Database connection issues**: Check security group rules and subnet configuration
2. **ECS service not starting**: Verify task definition and IAM roles
3. **Load balancer health checks failing**: Ensure application is listening on correct port

### Useful Commands

```bash
# Check ECS service status
aws ecs describe-services --cluster todo-app-cluster --services todo-app-service

# View application logs
aws logs tail /ecs/todo-app --follow

# Test database connectivity
aws rds describe-db-instances --db-instance-identifier todo-app-db
```

## Next Steps

1. Add SSL certificate for HTTPS
2. Implement CI/CD pipeline
3. Add monitoring and alerting
4. Set up backup strategies
5. Implement auto-scaling policies
