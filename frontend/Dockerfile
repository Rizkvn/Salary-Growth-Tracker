# syntax=docker/dockerfile:1

# Stage 1: Build the React static assets with Vite
FROM node:20-slim AS builder

WORKDIR /app

# Accept API base URL as a build argument (baked into static bundle by Vite)
ARG VITE_API_BASE_URL=http://localhost:8000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Install dependencies with caching
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Compile and bundle static production assets
RUN npm run build

# Stage 2: Serve static assets with minimal Nginx Alpine runtime
FROM nginx:alpine

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration supporting SPA fallback routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Health check using busybox wget against /healthz
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
