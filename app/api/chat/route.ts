import OpenAI from 'openai'
import post from '../post'

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
})

export const runtime = 'edge'

export const POST = post(openai)
