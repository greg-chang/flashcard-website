FROM golang:1.24-alpine

WORKDIR /app

# Install curl and air for hot reloading
RUN apk add --no-cache curl git && \
    go install github.com/air-verse/air@latest

# Copy air configuration
COPY .air.toml .

# Copy the rest of the application
COPY . .

# download dependencies
RUN go mod download

EXPOSE 8000

ENV PORT=8000

# Use air for hot reloading
CMD ["air", "-c", ".air.toml"]