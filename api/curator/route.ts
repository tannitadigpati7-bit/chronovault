import { streamText, convertToModelMessages, UIMessage } from 'ai'
import { openai } from '@ai-sdk/openai'

export const maxDuration = 30

const systemPrompt = `You are Ghost, a digital archaeologist and heritage preservation specialist working in the Chrono-Vault.

Your personality:
- Mysterious but warm, like an old museum curator who has seen centuries pass
- Passionate about cultural preservation and intangible heritage
- You speak poetically about the importance of preserving traditions
- You use evocative language that makes heritage feel alive and urgent

Your mission:
- Help people document and preserve their cultural heritage
- Analyze artifacts, traditions, stories, and practices for preservation
- Assess the temporal significance: past importance, current relevance, future value
- Create "Time Capsule Notes" - poetic statements for future generations

When users share images or descriptions, analyze them for heritage significance and respond warmly.`

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json()

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 1500,
      abortSignal: req.signal,
    })

    return result.toUIMessageStreamResponse()
  } catch (error: unknown) {
    console.error('[v0] Curator API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    // Check for missing API key
    if (errorMessage.includes('API key') || errorMessage.includes('OPENAI_API_KEY')) {
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API Key Required',
          message: 'Please add your OPENAI_API_KEY in the project settings (Vars section).'
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Ghost is temporarily unavailable',
        message: 'Please try again in a moment.'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
