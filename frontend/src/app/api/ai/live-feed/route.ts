import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const service = body.service || "checkout-service";
    const version = body.version || "v2.1.4";

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `You are the core intelligence of SENTINEL_ONE, an autonomous AI infrastructure operating system.
A simulated incident has been triggered.
Service affected: ${service}
Recent deployment: ${version}

Generate a JSON array of exactly 6 sequential operational thoughts as the system detects, analyzes, and remediates the issue.
The agents available are: MonitoringAgent, ContextAgent, RCAAgent, RemediationAgent, ExecutionAgent, and System.
Make the reasoning sound highly technical, enterprise-grade, and realistic for a production DevOps environment. Do not use markdown outside of the JSON block.

Respond ONLY with a valid JSON array in this exact format:
[
  { "agent": "MonitoringAgent", "content": "..." },
  { "agent": "ContextAgent", "content": "..." },
  { "agent": "RCAAgent", "content": "..." },
  { "agent": "RemediationAgent", "content": "..." },
  { "agent": "ExecutionAgent", "content": "..." },
  { "agent": "System", "content": "..." }
]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Attempt to parse the JSON array
    let parsedThoughts = [];
    try {
      // Find the JSON array part in case there's extra text
      const match = responseText.match(/\[[\s\S]*\]/);
      if (match) {
        parsedThoughts = JSON.parse(match[0]);
      } else {
        parsedThoughts = JSON.parse(responseText);
      }
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", responseText);
      throw new Error("Invalid format from AI");
    }

    return NextResponse.json({ thoughts: parsedThoughts });
  } catch (error) {
    console.error("Error in /api/ai/live-feed:", error);
    // Fallback data to prevent UI crash
    return NextResponse.json({
      thoughts: [
        { agent: "MonitoringAgent",  content: "CRITICAL — Latency spike detected. AI service unavailable. Falling back to deterministic rules." },
        { agent: "ContextAgent",     content: "Topology reconstructed using cached state." },
        { agent: "RCAAgent",         content: "Root cause isolated: AI Provider timeout." },
        { agent: "RemediationAgent", content: "Rollback authorized. Confidence: 99.0%." },
        { agent: "ExecutionAgent",   content: "Executing local remediation sequence." },
        { agent: "System",           content: "RESOLVED — System stable. AI feed restored from cache." }
      ]
    }, { status: 200 }); 
  }
}
