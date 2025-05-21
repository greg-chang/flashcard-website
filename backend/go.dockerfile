FROM golang:1.22-alpine

WORKDIR /app

# Install curl for health check
RUN apk add --no-cache curl

COPY . .

# download dependencies
RUN go mod download

# build the application
RUN go build -o main .

EXPOSE 8000

ENV PORT=8000

CMD ["./main"]