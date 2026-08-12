FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package manifests first for efficient layer caching
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Expose the port backend listens on
EXPOSE 8000

# Set environment
ENV NODE_ENV=production

# Start the server
CMD ["node", "app.js"]
