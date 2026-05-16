import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { context } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `Analyze this infrastructure context and provide a single concise root cause reasoning sentence:
Context: ${context}
Format: Operational, concise, technical. No markdown.`;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ reason: result.response.text().trim() });
  } catch (error) {
    return NextResponse.json({ reason: "Analysis temporarily unavailable due to AI timeout." }, { status: 200 });
  }
}
