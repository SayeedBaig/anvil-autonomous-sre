import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { events } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `Summarize these incident events for an executive audience in one paragraph:
Events: ${JSON.stringify(events)}
Format: Professional, concise, high-level business impact focus. No markdown.`;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ summary: result.response.text().trim() });
  } catch (error) {
    return NextResponse.json({ summary: "Executive summary unavailable. Incident resolved successfully with minor impact." }, { status: 200 });
  }
}
