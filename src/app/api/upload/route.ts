import { NextResponse } from "next/server";
import * as z from "zod";
import { GoogleGenAI } from "@google/genai";

const FileSchema = z.object({
  name: z.string(),
  type: z.string(),
  size: z.number(),
});

// POST /api/upload
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    // Zod validerar filinfo (men inte data)
    FileSchema.parse({
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Läs som base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    const ai = new GoogleGenAI({
      apiKey: process.env.API!,
    });

    const contents = [
      {
        inlineData: {
          mimeType: file.type,
          data: base64,
        },
      },
      {
        text: "Caption this image. Make it 1 sentence long.",
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    return NextResponse.json({
      caption: response.text,
    });
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
