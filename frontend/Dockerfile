# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app/src/

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that your frontend will run on
EXPOSE 3000

# Command to start your frontend application
CMD [ "npm", "start" ]
