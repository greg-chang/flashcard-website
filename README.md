# Flashcard Website

A full-stack flashcard application built with Go, PostgreSQL, and Next.js.

## Prerequisites

- Docker
- Docker Compose

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd flashcard-website
```

2. Start the application:
```bash
docker compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Go backend on port 8000
- Next.js frontend on port 3000

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/go

## Database

The application uses PostgreSQL with the following configuration:
- Database: flashcardDB
- User: postgres
- Password: postgres
- Port: 5432

To connect to the database:
```bash
docker exec -it db psql -U postgres -d flashcardDB
```

## Development

### Hot Reload vs Full Restart

The application uses Air for hot reloading in development. Here's when to use each approach:

#### Use Hot Reload (Air)
- Making changes to Go code files (`.go` files)
- Modifying frontend code (Next.js files)
- Updating API endpoints
- Making changes to business logic
- Debugging application behavior

#### Use Full Restart (`docker compose down`)
- Making changes to `compose.yaml`
- Modifying `setup.sql`
- Changing environment variables in Docker configuration
- Resetting database state
- Experiencing container issues
- Needing a completely fresh start

### Restarting the Application

If you make changes that require a full restart:
```bash
docker compose down
docker compose up --build
```

### Cleaning Up

To remove all containers and start fresh:
```bash
docker compose down -v
docker compose up --build
```

## Project Structure

```
flashcard-website/
├── backend/           # Go backend
│   ├── setup.sql     # Database schema
│   └── ...
├── frontend/         # Next.js frontend
│   └── ...
└── compose.yaml      # Docker configuration
``` 