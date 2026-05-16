from typing import List, Dict, Any, TypedDict, Optional
from pydantic import BaseModel

class Metric(BaseModel):
    cpu: float
    latency: float
    error_rate: float
    service: str

class Thought(BaseModel):
    agent: str
    content: str
    timestamp: float

class Action(BaseModel):
    tool: str
    parameters: Dict[str, Any]
    reasoning: str

class AgentState(TypedDict):
    incident_id: str
    status: str  # detected, investigating, remediating, resolved
    telemetry_data: List[Dict]
    context_memory: List[Dict]
    root_cause: Optional[str]
    remediation_plan: List[Action]
    execution_status: Optional[str]
    confidence_score: float
    agent_thoughts: List[Dict]
    current_agent: str
    security_alerts: List[Dict]
    optimization_data: Dict[str, Any]
    causal_graph: Dict[str, Any]
    metadata: Dict[str, Any]
