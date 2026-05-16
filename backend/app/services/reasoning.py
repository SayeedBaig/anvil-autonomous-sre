import logging
import os
from typing import Any, Dict, Optional

from langchain_core.messages import HumanMessage, SystemMessage

logger = logging.getLogger(__name__)


def _build_llm() -> Optional[Any]:
    """Construct LLM client if optional deps and API keys are available."""
    model_name = os.getenv("SENTINEL_MODEL", "gpt-4o")
    api_key = os.getenv("OPENAI_API_KEY")
    google_key = os.getenv("GOOGLE_API_KEY")

    if api_key:
        try:
            from langchain_openai import ChatOpenAI

            return ChatOpenAI(model=model_name, api_key=api_key)
        except ImportError:
            logger.warning("[ReasoningService] OPENAI_API_KEY set but langchain-openai is not installed.")

    if google_key:
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI

            return ChatGoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=google_key)
        except Exception as e:
            logger.warning("[ReasoningService] Could not initialize Gemini client: %s", e)

    return None


class ReasoningService:
    def __init__(self):
        self.llm = _build_llm()

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
            response = await self.llm.ainvoke(
                [SystemMessage(content="You are an elite SRE AI."), HumanMessage(content=prompt)]
            )
            return response.content
        except Exception as e:
            logger.warning("[ReasoningService] ainvoke failed, using simulated output: %s", e)
            return (
                "Simulated Reasoning: Correlating metrics with recent deployment v2.1.4. "
                "Identifying potential thread leak in checkout-service."
            )
