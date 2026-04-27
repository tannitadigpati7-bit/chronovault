export type RelicCategory = 'artifact' | 'practice' | 'profession' | 'story' | 'language' | 'everyday'
export type RelicStatus = 'draft' | 'published' | 'archived'
export type MediaType = 'image' | 'audio' | 'video'
export type QRType = 'view' | 'ar' | 'contribute'

export interface Profile {
  id: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  location: string | null
  created_at: string
}

export interface Relic {
  id: string
  user_id: string
  title: string
  description: string | null
  story: string | null
  category: RelicCategory
  subcategory: string | null
  tags: string[]
  origin_region: string | null
  origin_country: string | null
  cultural_group: string | null
  time_period: string | null
  estimated_era: string | null
  ai_significance: string | null
  ai_preservation_urgency: number | null
  ai_related_traditions: string[]
  ai_current_relevance: string | null
  ai_future_importance: string | null
  ai_time_capsule_note: string | null
  ai_museum_ready: boolean
  primary_image_url: string | null
  status: RelicStatus
  is_verified: boolean
  view_count: number
  created_at: string
  updated_at: string
  // Joined data
  profile?: Profile
  media?: RelicMedia[]
}

export interface RelicMedia {
  id: string
  relic_id: string
  user_id: string
  media_type: MediaType
  blob_url: string
  blob_pathname: string
  caption: string | null
  ai_description: string | null
  transcript: string | null
  display_order: number
  created_at: string
}

export interface RelicQRCode {
  id: string
  relic_id: string | null
  code: string
  qr_type: QRType
  scan_count: number
  created_at: string
}

export interface CuratorConversation {
  id: string
  user_id: string | null
  session_id: string | null
  messages: CuratorMessage[]
  context: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface CuratorMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  imageUrl?: string
}

export interface Collection {
  id: string
  user_id: string
  title: string
  description: string | null
  is_public: boolean
  created_at: string
  // Joined data
  items?: CollectionItem[]
  relics?: Relic[]
}

export interface CollectionItem {
  id: string
  collection_id: string
  relic_id: string
  display_order: number
  added_at: string
}

export const CATEGORY_LABELS: Record<RelicCategory, string> = {
  artifact: 'Physical Artifacts',
  practice: 'Cultural Practices',
  profession: 'Professions & Skills',
  story: 'Stories & Oral History',
  language: 'Languages & Dialects',
  everyday: 'Everyday Objects'
}

export const CATEGORY_ICONS: Record<RelicCategory, string> = {
  artifact: '🏺',
  practice: '🎭',
  profession: '🔨',
  story: '📖',
  language: '💬',
  everyday: '🏠'
}

export const CATEGORY_DESCRIPTIONS: Record<RelicCategory, string> = {
  artifact: 'Traditional crafts, tools, religious items, heirlooms',
  practice: 'Rituals, traditions, recipes, folk songs',
  profession: 'Dying trades like blacksmithing, weaving, etc.',
  story: 'Family histories, myths, legends',
  language: 'Regional languages, phrases, expressions',
  everyday: 'Objects that make up heritage in daily life'
}
