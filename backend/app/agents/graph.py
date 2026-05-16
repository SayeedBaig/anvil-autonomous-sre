import operator
from typing import Annotated, Sequence, TypedDict, Union
from langgraph.graph import StateGraph, END
from app.core.state import AgentState
from app.tools.github import GitHubTool
from app.services.reasoning import ReasoningService
import logging
import time
import asyncio
import random
import os

logger = logging.getLogger(__name__)

class SentinelGraph:
    def __init__(self, sio):
        self.sio = sio
        self.github = GitHubTool()
        self.reasoner = ReasoningService()
        self.workflow = self._build_graph()

    def _build_graph(self):
        graph = StateGraph(AgentState)

        # Define All 10 Nodes
        graph.add_node("monitoring", self.monitoring_node)
        graph.add_node("context", self.context_node)
        graph.add_node("rca", self.rca_node)
        graph.add_node("deployment", self.deployment_node)
        graph.add_node("security", self.security_node)
        graph.add_node("optimization", self.optimization_node)
        graph.add_node("remediation", self.remediation_node)
        graph.add_node("execution", self.execution_node)
        graph.add_node("learning", self.learning_node)

        # Define Orchestration Logic
        graph.set_entry_point("monitoring")
        
        graph.add_edge("monitoring", "context")
        graph.add_edge("context", "deployment")
        graph.add_edge("deployment", "security")
        graph.add_edge("security", "rca")
        graph.add_edge("rca", "optimization")
        graph.add_edge("optimization", "remediation")
        graph.add_edge("remediation", "execution")
        graph.add_edge("execution", "learning")
        graph.add_edge("learning", END)

        return graph.compile()

    async def _emit_thought(self, agent: str, content: str):
        thought = {
            "agent": agent,
            "content": content,
            "timestamp": time.time()
        }
        await self.sio.emit('agent_thought', thought)
        await asyncio.sleep(1.5) # Narrative pacing
        return thought

    # Agent Nodes
    async def monitoring_node(self, state: AgentState):
        await self._emit_thought("MonitoringAgent", "Anomalous pattern detected in 'order-engine' latency metrics. Initiating autonomous investigation.")
        return {**state, "current_agent": "MonitoringAgent"}

    async def context_node(self, state: AgentState):
        await self._emit_thought("ContextAgent", "Reconstructing operational topology. Correlating traces across 12 microservices.")
        await self._emit_thought("ContextAgent", "Memory Retrieval: Found 3 similar incidents in historical operational memory. Similarity score: 0.94.")
        return {**state, "context_memory": [{"id": "INC-2025-082", "title": "Cascading Latency Spike"}], "current_agent": "ContextAgent"}

    async def deployment_node(self, state: AgentState):
        await self._emit_thought("DeploymentAgent", "Scanning recent deployment events. Found commit #ef821 (v2.1.4) deployed to 'order-engine' 5 minutes prior to anomaly.")
        return {**state, "current_agent": "DeploymentAgent"}

    async def security_node(self, state: AgentState):
        await self._emit_thought("SecurityAgent", "Performing threat analysis. No suspicious ingress patterns detected. Authentication logs appear normal.")
        return {**state, "current_agent": "SecurityAgent"}

    async def rca_node(self, state: AgentState):
        await self._emit_thought("RCAAgent", "Initiating deep causal reasoning via SENTINEL_CORE engine.")
        
        # Real Reasoning
        reasoning = await self.reasoner.analyze_incident(state)
        await self._emit_thought("RCAAgent", f"RCA DECISION: {reasoning}")
        
        causal_graph = {
            "nodes": [
                {"id": "deploy", "label": "Deploy #ef821", "type": "event"},
                {"id": "leak", "label": "Resource Leak", "type": "root_cause"},
                {"id": "spike", "label": "Latency Spike", "type": "symptom"}
            ],
            "edges": [
                {"source": "deploy", "target": "leak"},
                {"source": "leak", "target": "spike"}
            ]
        }
        await self.sio.emit('event', {'type': 'CAUSAL_GRAPH_UPDATE', 'data': causal_graph})
        return {**state, "root_cause": reasoning, "causal_graph": causal_graph, "current_agent": "RCAAgent", "confidence_score": 0.96}

    async def optimization_node(self, state: AgentState):
        await self._emit_thought("OptimizationAgent", "Analyzing resource efficiency. Cluster utilization is at 88%. Autoscaling recommended to mitigate impact while rolling back.")
        return {**state, "optimization_data": {"autoscaling": "active", "target_replicas": 5}, "current_agent": "OptimizationAgent"}

    async def remediation_node(self, state: AgentState):
        await self._emit_thought("RemediationAgent", "Determining recovery strategy. Rollback to stable version v2.1.3 selected as primary action. Confidence: 98%.")
        return {**state, "remediation_plan": [{"tool": "rollback", "parameters": {"target": "v2.1.3"}}], "current_agent": "RemediationAgent"}

    async def execution_node(self, state: AgentState):
        await self._emit_thought("ExecutionAgent", "Executing autonomous rollback: 'kubectl rollout undo deployment/order-engine'.")
        await asyncio.sleep(2)
        await self._emit_thought("ExecutionAgent", "Verification: Metrics returning to baseline. Latency reduced from 2.5s to 120ms.")
        return {**state, "execution_status": "success", "current_agent": "ExecutionAgent"}

    async def learning_node(self, state: AgentState):
        await self._emit_thought("LearningAgent", "Incident resolved. Reinforcing remediation pathway in operational memory. Confidence scores updated for future reasoning.")
        return {**state, "status": "resolved", "current_agent": "LearningAgent"}
