# Use an official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (for npm)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the React app (ensure the dist directory is created)
RUN npm run build

# Expose port 5000 (default for serve)
EXPOSE 3000

# Start the production server using serve
CMD ["npm", "run", "dev"]
