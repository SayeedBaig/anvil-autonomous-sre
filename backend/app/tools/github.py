import os
import requests
from typing import Dict, Any

class GitHubTool:
    def __init__(self, token: str = None):
        self.token = token or os.getenv("GITHUB_TOKEN")
        self.headers = {
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github.v3+json"
        }

    def create_incident_issue(self, repo: str, incident_data: Dict[str, Any]) -> str:
        """Creates an autonomous incident report on GitHub."""
        url = f"https://api.github.com/repos/{repo}/issues"
        
        title = f"🛡️ SENTINEL_ONE Incident: {incident_data.get('incident_id')}"
        body = f"""
## Autonomous Operational Intelligence Report

**Status**: {incident_data.get('status')}
**Root Cause**: {incident_data.get('root_cause')}
**Confidence**: {incident_data.get('confidence_score') * 100}%

### Agent Thoughts
{self._format_thoughts(incident_data.get('agent_thoughts', []))}

### Recommended Action
{incident_data.get('remediation_plan')}

---
*Generated autonomously by Sentinel_Core.*
"""
        data = {"title": title, "body": body, "labels": ["sentinel-incident", "automated-rca"]}
        
        try:
            response = requests.post(url, json=data, headers=self.headers)
            response.raise_for_status()
            return response.json().get("html_url")
        except Exception as e:
            return f"Failed to create GitHub issue: {str(e)}"

    def _format_thoughts(self, thoughts: list) -> str:
        return "\n".join([f"- **{t['agent']}**: {t['content']}" for t in thoughts])
