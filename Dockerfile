# Use Node.js LTS version as base image
FROM node:16

# Metadata about the image
LABEL authors="jamie"

# Set the working directory in the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3006

# Start the application
CMD ["node", "index.js"]