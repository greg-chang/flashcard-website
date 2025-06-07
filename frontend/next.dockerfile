FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# # Uncomment to build production
# # Build the application
# RUN pnpm run build


# Expose the port
EXPOSE 3000

# # Uncomment for production
# # Start the application
# CMD ["pnpm", "start"] 

# Start the application in development mode
CMD ["pnpm", "run", "dev"] 