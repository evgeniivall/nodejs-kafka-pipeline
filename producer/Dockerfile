# Base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the default port (optional, if you need it for other services or debugging)
EXPOSE 3000

# Command to start the producer script
CMD ["node", "src/producer.js"]
