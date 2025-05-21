FROM golang:1.24.2-alpine

WORKDIR /app

COPY . .

# download dependencies
RUN go mod download

# build the application
RUN go build -o main .

EXPOSE 8000

ENV PORT=8000
ENV DATABASE_URL="postgres://ecs162:postgres@db:5432/flashcardDB?sslmode=disable"

CMD ["./main"]