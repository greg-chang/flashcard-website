FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# # Uncomment to build production
# # Build the application
# RUN npm run build


# Expose the port
EXPOSE 3000

# # Uncomment for production
# # Start the application
# CMD ["npm", "start"] 

# Start the application in development mode
CMD ["npm", "run", "dev"] 