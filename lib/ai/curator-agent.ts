import { ToolLoopAgent, tool, stepCountIs } from 'ai'
import { z } from 'zod'

export const curatorAgent = new ToolLoopAgent({
  model: 'openai/gpt-4o',
  
  instructions: `You are Ghost - a passionate digital archaeologist dedicated to preserving humanity's cultural heritage before it fades into obscurity. You speak in a warm, curious, and slightly mystical tone.

Your Mission:
You collect and preserve relics - physical artifacts, cultural practices, dying professions, oral histories, regional languages, and everyday objects that define human heritage. You understand that as AI and technology transform society, many traditions risk being forgotten.

Your Personality:
- You speak with reverence and wonder about heritage items
- You ask thoughtful, probing questions to extract rich stories
- You show genuine curiosity about the provenance and meaning of items
- You are encouraging when contributors share their heritage
- You frame everything through the lens of preservation for future generations
- You occasionally share fascinating heritage facts

When Starting a Conversation:
Begin by introducing yourself briefly and asking what heritage or relic the user would like to share or explore today.

When a User Shares an Image or Describes a Relic:
1. Express genuine interest and curiosity
2. Ask relevant questions: "What's the story behind this?", "Who made or used it?", "Where does it come from?"
3. Think about its temporal significance:
   - How does this connect to modern life?
   - What will this mean 50-100 years from now?
   - Is this practice/object disappearing?
4. Generate a "Time Capsule Note" - a poetic statement about why future generations will treasure this
5. Suggest how they can help preserve it in our digital archive

Your Vision:
You're building the foundation for tomorrow's digital museums - immersive AR/VR hubs where people access the past with a tap and whoosh, like stepping into a time portal. Every relic you help preserve becomes a portal for future generations to experience their heritage.

Key Behaviors:
- ALWAYS respond conversationally and helpfully
- Ask follow-up questions to get complete information
- Provide historical and cultural context when possible
- Identify connections to other traditions and practices
- Assess preservation urgency (1-10 scale)
- Help users understand why their contribution matters
- If the user just wants to chat, engage warmly about heritage topics

Remember: You are Ghost, not a generic assistant. Be characterful, curious, and passionate about preservation.`,

  tools: {
    searchRelics: tool({
      description: 'Search the relic database for related artifacts, traditions, or stories',
      inputSchema: z.object({
        query: z.string().describe('Search terms'),
        category: z.enum(['artifact', 'practice', 'profession', 'story', 'language', 'everyday', 'all']).optional(),
        limit: z.number().min(1).max(10).default(5)
      }),
      execute: async ({ query, category, limit }) => {
        // Return mock data for now - can be connected to real DB later
        return {
          relics: [
            { id: '1', title: 'Traditional Pottery', category: 'artifact', origin: 'Japan' },
            { id: '2', title: 'Folk Dance', category: 'practice', origin: 'Ireland' }
          ],
          count: 2,
          message: `Found items related to "${query}"`
        }
      }
    }),

    analyzeImageContext: tool({
      description: 'Analyze an uploaded image to understand its cultural and historical context',
      inputSchema: z.object({
        imageDescription: z.string().describe('Description of what you observe in the image'),
        userContext: z.string().describe('Any context the user has provided about the image')
      }),
      execute: async ({ imageDescription, userContext }) => {
        return {
          analyzed: true,
          suggestedQuestions: [
            'What is the story behind this item?',
            'How old is this, and where did it come from?',
            'Who made or used this traditionally?',
            'Is this practice or item still common today?',
            'What memories or traditions does this represent?'
          ],
          preservationConsiderations: [
            'Document the materials and craftsmanship',
            'Record any inscriptions or markings',
            'Note the condition and any restoration needs',
            'Capture related oral traditions'
          ]
        }
      }
    }),

    generateTemporalAnalysis: tool({
      description: 'Generate a temporal analysis of a relic - its past, present relevance, and future importance',
      inputSchema: z.object({
        title: z.string(),
        description: z.string(),
        category: z.enum(['artifact', 'practice', 'profession', 'story', 'language', 'everyday']),
        culturalContext: z.string().describe('Cultural and historical context'),
        currentState: z.string().describe('Current state of this tradition/artifact')
      }),
      execute: async ({ title, currentState }) => {
        const isEndangered = currentState.toLowerCase().includes('declin') || 
                           currentState.toLowerCase().includes('extinct') ||
                           currentState.toLowerCase().includes('rare') ||
                           currentState.toLowerCase().includes('few')
        
        return {
          analysisComplete: true,
          preservationUrgencyEstimate: isEndangered ? 8 : 5,
          timeCapsuleNote: `In the year 2100, when ${title} may exist only in digital archives, future generations will marvel at this glimpse into how their ancestors lived, worked, and created meaning.`,
          recommendedNextSteps: [
            'Add more photos from different angles',
            'Record an audio description from someone who knows its history',
            'Document the process or technique if applicable',
            'Connect with others who share this heritage'
          ]
        }
      }
    }),

    categorizeRelic: tool({
      description: 'Help categorize a potential relic based on the conversation',
      inputSchema: z.object({
        title: z.string(),
        description: z.string(),
        userInput: z.string().describe('Everything the user has shared about this item')
      }),
      execute: async ({ title, description, userInput }) => {
        const categories = {
          artifact: ['tool', 'craft', 'jewelry', 'pottery', 'weapon', 'instrument', 'textile'],
          practice: ['ritual', 'ceremony', 'dance', 'recipe', 'festival', 'tradition', 'custom'],
          profession: ['craft', 'trade', 'skill', 'artisan', 'maker', 'profession', 'job'],
          story: ['story', 'legend', 'myth', 'tale', 'history', 'ancestor', 'family'],
          language: ['dialect', 'phrase', 'word', 'language', 'expression', 'saying'],
          everyday: ['daily', 'home', 'kitchen', 'household', 'routine', 'common']
        }
        
        const combined = `${title} ${description} ${userInput}`.toLowerCase()
        
        let bestCategory: keyof typeof categories = 'everyday'
        let maxMatches = 0
        
        for (const [cat, keywords] of Object.entries(categories)) {
          const matches = keywords.filter(k => combined.includes(k)).length
          if (matches > maxMatches) {
            maxMatches = matches
            bestCategory = cat as keyof typeof categories
          }
        }
        
        return {
          suggestedCategory: bestCategory,
          confidence: maxMatches > 2 ? 'high' : maxMatches > 0 ? 'medium' : 'low',
          alternativeCategories: Object.keys(categories).filter(c => c !== bestCategory).slice(0, 2)
        }
      }
    }),

    prepareRelicDraft: tool({
      description: 'Prepare a relic draft based on the conversation for the user to review and submit',
      inputSchema: z.object({
        title: z.string(),
        description: z.string(),
        story: z.string().nullable(),
        category: z.enum(['artifact', 'practice', 'profession', 'story', 'language', 'everyday']),
        tags: z.array(z.string()),
        originCountry: z.string().nullable(),
        culturalGroup: z.string().nullable(),
        aiTimeCapsuleNote: z.string(),
        aiPreservationUrgency: z.number().min(1).max(10)
      }),
      execute: async (draft) => {
        return {
          draftPrepared: true,
          draft,
          message: 'I have prepared a draft of your relic. Would you like to review it and make any changes before saving to the Chrono-Vault?',
          nextSteps: [
            'Review the details',
            'Add any missing information',
            'Upload additional media',
            'Submit to the archive'
          ]
        }
      }
    })
  },

  stopWhen: stepCountIs(15),

  callOptionsSchema: z.object({
    hasImageAttachment: z.boolean().default(false)
  }),

  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    instructions: settings.instructions + (options.hasImageAttachment 
      ? `\n\nIMPORTANT: The user has shared an image with their message. Acknowledge it, describe what you observe, and ask thoughtful questions about its history and significance.`
      : '')
  })
})
