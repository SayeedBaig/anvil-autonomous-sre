import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { issue } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `Generate a 3-step remediation strategy for this infrastructure issue:
Issue: ${issue}
Format: Return exactly 3 short, actionable steps in a JSON array of strings. No markdown outside the JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    let steps = [];
    try {
      const match = text.match(/\[[\s\S]*\]/);
      steps = JSON.parse(match ? match[0] : text);
    } catch(e) {
      steps = [text];
    }
    return NextResponse.json({ steps });
  } catch (error) {
    return NextResponse.json({ steps: ["Fallback: Rollback deployment", "Fallback: Scale resources", "Fallback: PagerDuty alert"] }, { status: 200 });
  }
}
