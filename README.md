# Automation Node

<p align="center">
  <strong>A visual workflow builder made with React Flow + FastAPI</strong>
</p>

<p align="center">
  Build pipelines visually, connect custom nodes, and validate the flow on the backend.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Flow-React%20Flow-0EA5E9?style=for-the-badge" alt="React Flow" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Purpose-Learning%20Project-F59E0B?style=for-the-badge" alt="Learning Project" />
</p>

---

## What Is This? 

Automation Node is a visual pipeline builder where workflows are created by connecting nodes on a canvas. The frontend is built with React and React Flow, while the backend uses FastAPI to receive the pipeline data, validate it, and check whether the structure forms a valid DAG.

This project is a hands-on learning build I made to understand how React Flow works in a real app and how frontend and backend pieces connect together.

## Why I Built It

I created this project to learn:

- how React Flow works under the hood
- how node-based UIs are built in React
- how to manage nodes, edges, and canvas interactions
- how frontend data is sent to a backend API
- how backend validation works for graph-like workflow data
- how DAG validation helps confirm whether a pipeline is valid

## Highlights

- Flow-based UI with draggable nodes
- Custom node types for building different pipeline steps
- Edge connections between nodes
- Frontend submission to the backend
- Backend validation for invalid edges and self-loops
- DAG detection to check if the pipeline contains cycles

## Tech Stack

- `React`
- `React Flow`
- `FastAPI`
- `Pydantic`

## Project Structure

```text
Automation node/
  backend/
    main.py
  frontend/
    src/
    public/
  README.md
```

## Run Locally

### Backend

```bash
cd backend
python -m pip install fastapi uvicorn pydantic
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at:

```text
http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```text
http://localhost:3000
```

## API

### `POST /pipelines/parse`

This endpoint receives the pipeline from the frontend and returns:

- number of nodes
- number of edges
- whether the pipeline is a DAG
- any invalid edges found during validation

## What I Learned

While building this project, I got practical experience with:

- building graph-based interfaces using React Flow
- connecting frontend state to backend API requests
- validating structured workflow data on the backend
- detecting cycles in a pipeline graph
- thinking about how visual automation tools work behind the scenes

## Final Note

This is a learning project, but it helped me explore both sides of the app:

- the frontend experience of creating flows visually
- the backend logic that validates whether those flows actually make sense

That combination was the main reason I built Automation Node.
