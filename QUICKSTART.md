# 🚀 Relic Curator - Quick Start Guide

## Prerequisites

- Node.js 18+ and pnpm
- Supabase account (free tier works!)
- Vercel Blob storage enabled
- AI Gateway API access (Vercel)

---

## Local Development Setup

### 1. Clone & Install

```bash
# Install dependencies
pnpm install

# Create .env.local file with your keys:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
BLOB_READ_WRITE_TOKEN=your_blob_token
```

### 2. Database Setup

The database schema was already applied to your Supabase project. Verify by:

```bash
# Check that tables exist in Supabase dashboard:
- profiles
- relics
- relic_media
- relic_qr_codes
- curator_conversations
- collections
- collection_items
```

### 3. Run Dev Server

```bash
pnpm dev
```

Visit `http://localhost:3000` and the app will be live with HMR!

---

## Deployment to Vercel

### 1. Connect Git Repository

```bash
# If not already connected:
vercel git connect
# or link manually in Vercel dashboard
```

### 2. Set Environment Variables

In Vercel Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://[your-domain].vercel.app/auth/callback
BLOB_READ_WRITE_TOKEN
```

### 3. Deploy

```bash
vercel deploy --prod
```

---

## First-Time User Flow

### As a New User:

1. **Land on Homepage** (`/`)
   - See Ghost walking with heritage facts
   - Read "Why Relic Curator?" benefits
   - Click "Start Preserving" button

2. **Sign Up** (`/auth/sign-up`)
   - Enter email and password
   - Verify email (check inbox)
   - Set display name

3. **Explore Relics** (`/explore`)
   - Browse global heritage database
   - Search by keyword (e.g., "weaving", "language")
   - Filter by category (Artifact, Practice, Story, etc.)
   - Click any relic to see details

4. **Chat with Ghost** (`/curator`)
   - Click "Talk to Ghost"
   - Upload a photo of something meaningful
   - Answer Ghost's questions
   - Get AI-powered analysis

5. **Make Your First Contribution** (`/contribute`)
   - Tell Ghost about your heritage
   - Upload multimedia (images, audio, video)
   - Get temporal significance analysis
   - Publish to gallery

---

## Admin Tasks

### Check Database Health

```bash
# In Supabase dashboard:
1. Go to SQL Editor
2. Run:
   SELECT COUNT(*) as total_relics FROM relics WHERE status = 'published';
   SELECT COUNT(*) as users FROM auth.users;
   SELECT COUNT(*) as media FROM relic_media;
```

### View Recent Submissions

```sql
SELECT id, title, category, created_at, ai_preservation_urgency 
FROM relics 
WHERE status = 'published'
ORDER BY created_at DESC 
LIMIT 10;
```

### Check Storage Usage

```bash
# In Vercel dashboard:
1. Project → Storage → Blob
2. See total files and space used
```

---

## Common Tasks

### Generate QR Codes for a Relic

1. Go to relic detail page (`/relic/[id]`)
2. Scroll to "QR Codes" section
3. Click "Generate QR Code"
4. Choose type: View / AR / Contribute
5. Copy/download/share

### Search Global Database

1. Go to `/explore`
2. Use search bar for keywords
3. Filter by category (top left)
4. Sort by date, urgency, or views

### Monitor Chat Interactions

```sql
SELECT 
  COUNT(*) as total_conversations,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(array_length(messages, 1)) as avg_messages_per_chat
FROM curator_conversations;
```

---

## Troubleshooting

### "Environment variables not found"

**Solution**: Make sure `.env.local` has all required variables:
```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
BLOB_READ_WRITE_TOKEN
```

### "Auth callback fails"

**Solution**: Check that `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` matches:
- Localhost: `http://localhost:3000/auth/callback`
- Production: `https://[your-domain].vercel.app/auth/callback`

### "Images not loading in gallery"

**Solution**: Check Blob storage:
1. Verify `BLOB_READ_WRITE_TOKEN` is valid
2. Check file was uploaded (check Blob dashboard)
3. Ensure media route is working: `/api/file?pathname=...`

### "Ghost isn't responding"

**Solution**: Check AI Gateway setup:
1. Ensure Vercel AI Gateway is enabled
2. Check Claude/OpenAI API keys in Vercel dashboard
3. Monitor API logs for rate limiting

---

## File Structure

```
app/
  ├── page.tsx                 # Landing page with Ghost
  ├── layout.tsx               # Root layout
  ├── globals.css              # Chrono-Vault color system
  ├── explore/                 # Relic gallery
  ├── relic/[id]/              # Detail pages
  ├── curator/                 # Ghost chat interface
  ├── contribute/              # Submission forms
  ├── dashboard/               # User archive
  ├── auth/                    # Auth pages
  └── api/
      ├── curator/             # Ghost agent API
      ├── upload/              # Media uploads
      ├── enhance-relic/       # AI enhancement
      ├── qr/generate/         # QR generation
      └── file/                # File delivery

components/
  ├── ghost/                   # Ghost agent components
  ├── curator/                 # Chat UI
  ├── relics/                  # Gallery & detail
  ├── contribute/              # Submission UI
  ├── ui/                      # Shadcn components
  └── layout/                  # Header, navigation

lib/
  ├── types.ts                 # TypeScript definitions
  ├── ai/
  │   └── curator-agent.ts     # Ghost AI tools
  └── supabase/
      ├── client.ts
      ├── server.ts
      └── proxy.ts

scripts/
  ├── 001_create_schema.sql    # Database setup
  └── 002_add_functions.sql    # QR increment function
```

---

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase endpoint | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public auth key | `eyJxx...` |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Auth callback | `http://localhost:3000/auth/callback` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob access | `verified_xxx...` |

---

## Performance Optimization

### Caching
- SWR caches relic queries (60s)
- Blob files cached by browser (30d)
- Next.js ISR for explore page (1h)

### Database Indexes
Already created for:
- `relics(user_id, status, created_at)`
- `relic_media(relic_id)`
- `collections(user_id)`

### Image Optimization
- Next.js Image component for all photos
- Automatic WebP conversion
- Responsive sizing

---

## Monitoring & Analytics

### Check Real-Time Activity

```sql
-- Recent submissions
SELECT title, category, created_at 
FROM relics 
WHERE status = 'published'
ORDER BY created_at DESC LIMIT 5;

-- Most viewed relics
SELECT title, view_count, category
FROM relics
WHERE status = 'published'
ORDER BY view_count DESC LIMIT 10;

-- Preservation urgency distribution
SELECT 
  ai_preservation_urgency,
  COUNT(*) as count
FROM relics
WHERE status = 'published'
GROUP BY ai_preservation_urgency
ORDER BY ai_preservation_urgency DESC;
```

### Vercel Analytics

Dashboard shows:
- Page performance (LCP, FID, CLS)
- API response times
- Deployment history
- Environment variable usage

---

## Next Steps

1. **Customize Ghost**: Edit fun facts in `components/ghost/ghost-character.tsx`
2. **Add Sample Data**: Create starter relics in Supabase
3. **Setup Domain**: Connect custom domain in Vercel
4. **Enable Analytics**: Set up PostHog or Vercel Analytics
5. **Community Launch**: Invite first users to contribute

---

## Support & Documentation

- **Tech Docs**: See `IMPLEMENTATION_SUMMARY.md`
- **Ghost Guide**: See `GHOST_AGENT_GUIDE.md`
- **Future Plans**: See `FUTURE_IDEAS.md`
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs

---

## Success! 🎉

Your Relic Curator instance is now live and ready to preserve world heritage. Welcome to the Chrono-Vault! 🏛️✨
