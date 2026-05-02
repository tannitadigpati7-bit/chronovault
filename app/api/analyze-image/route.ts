import { streamText, convertToModelMessages } from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image) {
      return Response.json({ error: 'No image provided' }, { status: 400 })
    }

    const result = streamText({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              image: image,
            },
            {
              type: 'text',
              text: `You are Ghost, a digital archaeologist. Someone has uploaded an image. Analyze this image and provide:

1. What heritage significance could this have? (e.g., cultural artifact, traditional craft, everyday object, etc.)
2. Ask 3-4 thoughtful questions to understand:
   - The origin and cultural context
   - Its current importance in their life/culture
   - Why they think it should be preserved
   - Any stories or traditions connected to it

Be warm, curious, and encouraging. Even if the image shows something mundane, look for cultural markers or preservation opportunities.

Format your response as:
ANALYSIS: [Brief analysis of what you see and its potential heritage value]
QUESTIONS:
- Question 1?
- Question 2?
- Question 3?
- Question 4?`,
            },
          ],
        },
      ],
      maxOutputTokens: 800,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('[v0] Image analysis error:', error)
    return Response.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
