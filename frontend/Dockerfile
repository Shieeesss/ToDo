# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy everything else
COPY . .

# Expose port 3000
EXPOSE 3000

# Start Next.js
CMD ["npm", "run", "dev"]