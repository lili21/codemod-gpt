import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export const runtime = 'edge'

export const unstable_allowDynamic = [
  // This is currently required because `qs` uses `side-channel` which depends on this.
  '/node_modules/function-bind/**',
]

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const formData = await req.formData()

  const originCode = formData.get('originCode');
  const newCode = formData.get('newCode');

  const prompt = `
    generate jscodeshift transform code that modify
    ${originCode}
    to
    ${newCode}.Just return the string inside markdown code block"
  `

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    stream: true,
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for await (const part of completion) {
        const content = part.choices[0].delta.content;
        const _content = encoder.encode(content!)
        controller.enqueue(_content)
      }
    }
  })

  return new Response(stream, { status: 200 })
}
