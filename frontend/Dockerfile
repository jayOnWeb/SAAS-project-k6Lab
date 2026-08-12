# ==========================================
# Stage 1: Build Vite React Application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests for efficient layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies needed for Vite build)
RUN npm install

# Copy application source code
COPY . .

# Optional Build Argument for API URL (default can be injected via build arg)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build optimized production bundle
RUN npm run build

# ==========================================
# Stage 2: Serve with High-Performance Nginx
# ==========================================
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
