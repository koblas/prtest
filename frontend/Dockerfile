# Production stage - expects pre-built assets
FROM nginx:alpine3.20

# Copy pre-built files from host (built outside Docker)
COPY dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

