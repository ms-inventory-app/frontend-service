FROM node:18-alpine as build

WORKDIR /app

# Copy package files from the frontend directory
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy source code from the frontend directory
COPY frontend/ ./

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
