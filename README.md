# Automation Node

A visual pipeline builder with DAG validation.

This project includes:
- `frontend`: React + React Flow UI to build pipelines with draggable nodes and connections.
- `backend`: FastAPI service that validates submitted pipelines and checks whether they form a DAG.

## Features

- Drag-and-drop pipeline canvas
- Multiple node types (Input, LLM, Output, Text, Filter, Merge, Delay, API, Switch)
- Edge connections between nodes
- One-click pipeline submission from UI
- Backend validation for:
  - node/edge counts
  - invalid edge references
  - self-loops
  - DAG/cycle detection

## Project Structure

```text
Automation node/
  backend/
    main.py
  frontend/
    src/
    public/
    package.json
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+

## Backend Setup (FastAPI)

```bash
cd backend
python -m pip install fastapi uvicorn pydantic
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: `http://localhost:8000`

Health check:

```bash
curl http://localhost:8000/
```

## Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

## API

### `POST /pipelines/parse`

Validates a pipeline payload and returns summary + DAG status.

Request body:

```json
{
  "nodes": [
    { "id": "node-1", "type": "customInput", "data": {} }
  ],
  "edges": [
    { "source": "node-1", "target": "node-2" }
  ]
}
```

Response:

```json
{
  "num_nodes": 2,
  "num_edges": 1,
  "is_dag": true,
  "invalid_edges": null
}
```

## CORS Configuration

The backend uses `CORS_ALLOW_ORIGINS` (comma-separated) and defaults to `*`.

Example:

```bash
set CORS_ALLOW_ORIGINS=http://localhost:3000
```

## Development Notes

- The frontend currently calls `http://localhost:8000/pipelines/parse` directly.
- Start backend before submitting from the frontend UI.
- This repository contains both frontend and backend in a single project.
