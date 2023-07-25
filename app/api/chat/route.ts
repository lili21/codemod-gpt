import { NextResponse } from "next/server";
import OpenAI from "openai";
import { HttpsProxyAgent } from "https-proxy-agent";

const agent = new HttpsProxyAgent("http://localhost:8001");

export const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  httpAgent: agent,
});

// export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const formData = await req.formData()

  const originCode = formData.get('originCode');
  const newCode = formData.get('newCode');

  const prompt = `
    I want to use jscodeshift to do code refactor.It will read a jsx file, and the code may looks like
    ${originCode}
    and I need to tranform it to ${newCode}. show me the transform code"
  `

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    // stream: true,
  });

  return NextResponse.json(completion)
}
