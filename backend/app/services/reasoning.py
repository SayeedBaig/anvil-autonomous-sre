import os
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from typing import Dict, Any

class ReasoningService:
    def __init__(self):
        self.model_name = os.getenv("SENTINEL_MODEL", "gpt-4o")
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.google_key = os.getenv("GOOGLE_API_KEY")
        
        if self.api_key:
            self.llm = ChatOpenAI(model=self.model_name, api_key=self.api_key)
        elif self.google_key:
            self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=self.google_key)
        else:
            self.llm = None

    async def analyze_incident(self, state: Dict[str, Any]) -> str:
        """Performs deep reasoning over incident state."""
        if not self.llm:
            return "Simulated Reasoning: Correlating metrics with recent deployment v2.1.4. Identifying potential thread leak in checkout-service."

        prompt = f"""
        You are SENTINEL_CORE, a staff-level SRE autonomous agent.
        Analyze the following incident state and provide a deep technical root cause analysis.
        
        Incident ID: {state.get('incident_id')}
        Anomaly Type: {state.get('metadata', {}).get('anomaly_type')}
        Service: {state.get('metadata', {}).get('service')}
        Recent Deployment: v2.1.4 (Commit #ef821)
        
        Provide a 2-sentence highly technical RCA.
        """
        
        try:
            response = await self.llm.ainvoke([SystemMessage(content="You are an elite SRE AI."), HumanMessage(content=prompt)])
            return response.content
        except Exception as e:
            return f"Error in reasoning: {str(e)}"
