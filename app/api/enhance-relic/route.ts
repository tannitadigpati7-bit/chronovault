import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

const enhancementSchema = z.object({
  aiSignificance: z.string().describe('Cultural and historical significance of this relic'),
  aiCurrentRelevance: z.string().describe('How this relic connects to modern life and why it matters today'),
  aiFutureImportance: z.string().describe('Why this will be important 50-100 years from now when technology has transformed society'),
  aiTimeCapsuleNote: z.string().describe('A poetic, evocative statement for future generations about why they should treasure this'),
  aiPreservationUrgency: z.number().min(1).max(10).describe('Urgency of preservation: 1=stable tradition, 10=nearly extinct'),
  aiRelatedTraditions: z.array(z.string()).describe('Related traditions, practices, or artifacts from the same or similar cultures')
})

export async function POST(request: NextRequest) {
  try {
    const { title, description, category, story, culturalGroup, originCountry } = await request.json()
    
    const prompt = `You are a digital archaeologist and heritage preservation expert. Analyze this potential relic and provide insights about its cultural significance, present relevance, and future importance.

RELIC INFORMATION:
Title: ${title}
Category: ${category}
Description: ${description}
Story: ${story || 'Not provided'}
Cultural Group: ${culturalGroup || 'Not specified'}
Origin: ${originCountry || 'Not specified'}

Consider:
1. The cultural and historical significance of this item/practice
2. How it connects to daily life, identity, or spirituality in its culture
3. Whether this tradition/artifact is thriving, declining, or endangered
4. What future generations (50-100 years from now) would lose if this isn't preserved
5. How technology, globalization, and changing lifestyles affect its survival

For the Time Capsule Note, write something poetic and evocative that would resonate with someone in 2075-2125 who has grown up in an AI-dominated, highly technological world and is discovering their ancestors' heritage.

Be specific, culturally sensitive, and thoughtful in your analysis.`

    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      prompt,
      schema: enhancementSchema
    })
    
    return NextResponse.json(object)
  } catch (error) {
    console.error('Enhancement error:', error)
    
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('API key') || errorMessage.includes('OPENAI_API_KEY')) {
      return NextResponse.json({ 
        error: 'OpenAI API Key Required',
        message: 'Please add your OPENAI_API_KEY in the project settings.'
      }, { status: 401 })
    }
    
    return NextResponse.json({ error: 'Enhancement failed' }, { status: 500 })
  }
}
