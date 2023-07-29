import OpenAI from 'openai'
import { HttpsProxyAgent } from 'https-proxy-agent'
import post from '../post'

const agent = new HttpsProxyAgent('http://localhost:8001')

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
  httpAgent: agent,
})

// export const runtime = 'edge'

export const POST = post(openai)
