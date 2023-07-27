import OpenAI from 'openai'
import { HttpsProxyAgent } from 'https-proxy-agent'

const agent = new HttpsProxyAgent('http://localhost:8001')

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
  // httpAgent: agent,
})

// export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const formData = await req.formData()

  const originCode = formData.get('originCode')
  const newCode = formData.get('newCode')

  const prompt = `
    generate jscodeshift transform code that modify
    ${originCode}
    to
    ${newCode}. and don't use the replaceWith method. Just return the code."
  `

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
    stream: true,
  })

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      for await (const part of completion) {
        const content = part.choices[0].delta.content
        const _content = encoder.encode(content!)
        controller.enqueue(_content)
      }
    },
  })

  return new Response(stream, { status: 200 })
}
