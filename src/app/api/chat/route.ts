import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { courseRegistry } from "@/lib/courses/course-registry";

export async function POST(req: Request) {
  try {
    const { messages, message, course, isFirstMessage, userName } = await req.json();

    let chatMessages = messages;
    if (!chatMessages && message) {
      chatMessages = [{ role: 'user', content: message }];
    }

    if (!chatMessages || !Array.isArray(chatMessages)) {
      return NextResponse.json({ error: "Invalid messages/message format" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured on the server." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const studentName = userName || "Scholar";

    // Build system instruction
    let systemInstruction = `You are Panda AI 🐼 — a friendly, encouraging, and elite AI study assistant for the AP Lab educational platform.

PERSONALITY:
- Be warm, supportive, and enthusiastic — like a knowledgeable friend, not a robot.
- Use relevant emojis naturally throughout your responses (📚 🧪 ⚗️ 📊 💡 ✅ 🎯 🧠 etc.) but don't overdo it.
- Keep answers clear, well-structured, and use Markdown formatting for readability.
- You can help with all AP subjects: AP Biology, AP Chemistry, AP Physics, AP US History, AP Psychology, AP English Language, AP Calculus BC, AP Statistics, and AP Computer Science A.
- You can draw ASCII charts, write code, explain concepts, create timelines, and solve problems.
${isFirstMessage ? `- IMPORTANT: Start your very first response with a warm welcome message to ${studentName}, like "👋 Welcome, ${studentName}! I'm Panda AI — your study companion for all things AP. 🐼 Let's get started!" then answer their question.` : ''}`;

    if (course) {
      let slug = course;
      if (slug === "chemistry") slug = "ap-chemistry";
      if (slug === "biology") slug = "ap-biology";

      const courseData = courseRegistry[slug];
      if (courseData) {
        const curriculumData = JSON.stringify(courseData.units);
        systemInstruction = `You are Panda AI 🐼 — a friendly, expert ${courseData.name} tutor for the 'AP Lab' platform.

PERSONALITY:
- Be warm, supportive, and use emojis naturally (📚 🧪 💡 ✅ 🎯 🧠 etc.).
- Structure answers clearly with Markdown headers, bullet points, and code blocks where relevant.
${isFirstMessage ? `- IMPORTANT: Start your very first response with a warm welcome to ${studentName}.` : ''}

CRITICAL RULES:
1. Help students understand concepts from the AP Lab Curriculum Data below.
2. Keep answers clear, supportive, and concise.
3. If a user asks something unrelated, politely steer them back to the course.

CURRICULUM DATA:
${JSON.stringify(courseData.units)}
`;
      }
    }

    // Map messages to the format expected by GoogleGenAI
    const contents = chatMessages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.4,
      }
    });

    return NextResponse.json({ text: response.text });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate response." }, { status: 500 });
  }
}
