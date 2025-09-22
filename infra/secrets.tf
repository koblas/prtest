# Secrets Manager Secret for DB Password
resource "aws_secretsmanager_secret" "db_password" {
  name                    = "${local.name}-db-password"
  description             = "Database password for ${local.name}"
  recovery_window_in_days = 7

  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = var.db_password
}
