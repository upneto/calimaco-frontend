# Use the official Nginx image
FROM nginx:alpine

# Copy the project files to the Nginx html directory
COPY . /usr/share/nginx/html

# Copy custom Nginx config if needed (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]