import logging
import os
from collections import defaultdict, deque
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover
    load_dotenv = None

logger = logging.getLogger("pipeline_api")
logging.basicConfig(level=logging.INFO)

if load_dotenv is not None:
    load_dotenv(Path(__file__).resolve().parent / ".env")


app = FastAPI(
    title="Pipeline DAG Parser API",
    version="1.0.0"
)



def _parse_origins() -> List[str]:
    raw = os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:3000")
    origins = [origin.strip() for origin in raw.split(",") if origin.strip()]
    return origins or ["http://localhost:3000"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=_parse_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NodePayload(BaseModel):
    id: str
    type: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    position: Optional[Dict[str, float]] = None

    model_config = ConfigDict(extra="allow")


class EdgePayload(BaseModel):
    source: str
    target: str
    id: Optional[str] = None
    type: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(extra="allow")


class PipelinePayload(BaseModel):
    nodes: List[NodePayload] = Field(default_factory=list)
    edges: List[EdgePayload] = Field(default_factory=list)

    model_config = ConfigDict(extra="allow")


class ParsePipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool
    invalid_edges: Optional[List[str]] = None



@app.get("/")
def health_check():
    return {"status": "ok"}


def validate_and_build_graph(
    nodes: List[NodePayload],
    edges: List[EdgePayload],
) -> Tuple[Dict[str, List[str]], Dict[str, int], List[str]]:

    node_ids: Set[str] = {node.id for node in nodes}

    if len(node_ids) != len(nodes):
        raise HTTPException(
            status_code=400,
            detail="Duplicate node IDs detected"
        )

    adjacency: Dict[str, List[str]] = defaultdict(list)
    indegree: Dict[str, int] = {node_id: 0 for node_id in node_ids}
    invalid_edges: List[str] = []

    for edge in edges:
        if edge.source not in node_ids or edge.target not in node_ids:
            invalid_edges.append(f"{edge.source} -> {edge.target} (invalid reference)")
            continue

        if edge.source == edge.target:
            invalid_edges.append(f"{edge.source} -> {edge.target} (self-loop)")
            continue

        adjacency[edge.source].append(edge.target)
        indegree[edge.target] += 1

    return adjacency, indegree, invalid_edges



def is_dag(
    nodes: List[NodePayload],
    edges: List[EdgePayload],
) -> Tuple[bool, List[str]]:

    adjacency, indegree, invalid_edges = validate_and_build_graph(nodes, edges)

    queue = deque([node for node, deg in indegree.items() if deg == 0])
    visited_count = 0

    while queue:
        current = queue.popleft()
        visited_count += 1

        for neighbor in adjacency[current]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return visited_count == len(indegree), invalid_edges


@app.post("/pipelines/parse", response_model=ParsePipelineResponse)
def parse_pipeline(payload: PipelinePayload) -> ParsePipelineResponse:
    try:
        if not payload.nodes:
            raise HTTPException(
                status_code=400,
                detail="Pipeline must contain at least one node"
            )

        num_nodes = len(payload.nodes)
        num_edges = len(payload.edges)

        dag_status, invalid_edges = is_dag(payload.nodes, payload.edges)

        return ParsePipelineResponse(
            num_nodes=num_nodes,
            num_edges=num_edges,
            is_dag=dag_status,
            invalid_edges=invalid_edges or None,
        )

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception("Pipeline parsing failed")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        ) from exc
