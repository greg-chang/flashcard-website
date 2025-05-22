FROM golang:1.24.3-alpine

WORKDIR /app

RUN apk add --no-cache curl git && \
    go install github.com/air-verse/air@latest

COPY .air.toml .
COPY . .

RUN go mod download

CMD ["air", "-c", ".air.toml"] 