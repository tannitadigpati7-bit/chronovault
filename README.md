# 🏛️ Relic Curator: Preserving Heritage for Tomorrow

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-purple)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#license)

> An AI-powered digital archaeologist platform preserving cultural artifacts, traditions, languages, and heritage from around the world. Meet **Ghost**, your walking cartoonish companion who guides heritage preservation with intelligence, humor, and temporal wisdom.

---

## 🎯 Mission

In a world where AI and technology are rapidly replacing human work, endangered traditions, languages, and cultural practices are disappearing faster than ever. Relic Curator exists to:

✨ **Preserve Yesterday** - Document heritage before it vanishes
✨ **Understand Today** - Analyze why traditions matter right now
✨ **Build Tomorrow** - Create foundations for future digital museums where people access history with a tap and whoosh through AR/VR

---

## 🚀 Key Features

### 👻 Ghost Agent - Your Digital Archaeologist
- Walking cartoonish avatar that shares heritage fun facts
- Analyzes photos you upload and asks smart questions
- Generates temporal significance (current relevance + 50-100 year future importance)
- Creates poetic "Time Capsule Notes" for future generations
- Fading thought animations while processing insights

### 🗄️ Global Heritage Database
- Browse relics from cultures worldwide
- Search by tradition, culture, language, or category
- Read stories from heritage preservationists
- Discover connections between traditions
- Share your own cultural knowledge

### 📸 Multimedia Preservation
- Upload images, audio, and video
- AI auto-analysis and transcription
- Generate QR codes for sharing
- Create AR experiences for artifacts

### 🏛️ Chrono-Vault Design System
- Futuristic "burnished amber" aesthetic (#FF8C00 accents)
- Rich black archival base (#0A0A0A)
- Museum label serif typography
- Smooth Framer Motion animations
- Glassmorphic Bento Grid layouts

### 🌍 Community Features
- Contribute relics to global archive
- Create curated collections
- Connect with heritage communities
- Support endangered traditions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Framer Motion |
| **Auth** | Supabase Auth (email/password) |
| **Database** | Supabase PostgreSQL with RLS |
| **Storage** | Vercel Blob (private) |
| **AI** | Vercel AI Gateway + ToolLoopAgent |
| **Components** | shadcn/ui + custom components |
| **Deployment** | Vercel |

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm or npm
- Supabase account (free tier OK)
- Vercel Blob storage

### Installation

```bash
# Clone repository
git clone <repo-url>
cd relic-curator

# Install dependencies
pnpm install

# Create .env.local
cp .env.example .env.local

# Add your environment variables:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
BLOB_READ_WRITE_TOKEN=your_token

# Run dev server
pnpm dev
```

Visit `http://localhost:3000` 🎉

### Deployment

```bash
# Deploy to Vercel
vercel deploy --prod
```

**[→ Full setup guide](QUICKSTART.md)**

---

## 📁 Project Structure

```
relic-curator/
├── app/
│   ├── page.tsx              # Landing with Ghost
│   ├── explore/              # Relic gallery
│   ├── curator/              # Ghost chat interface
│   ├── contribute/           # Submit heritage
│   ├── relic/[id]/          # Detail pages
│   ├── auth/                # Authentication
│   └── api/                 # Backend routes
├── components/
│   ├── ghost/               # Ghost character & logs
│   ├── curator/             # Chat interface
│   ├── relics/              # Gallery components
│   ├── contribute/          # Form components
│   └── ui/                  # Shadcn components
├── lib/
│   ├── types.ts            # TypeScript types
│   ├── ai/curator-agent.ts # Ghost AI tools
│   └── supabase/           # DB clients
├── scripts/                 # Database migrations
├── public/                  # Static assets
└── docs/                    # Documentation
```

---

## 🎯 Core Components

### Ghost Character (`components/ghost/ghost-character.tsx`)
Animated walking avatar sharing heritage facts with emotion states:
- Idle (floating)
- Walking (animated step)
- Thinking (pulsing glow)
- Listening (leaning in)

### AI Curator Agent (`lib/ai/curator-agent.ts`)
ToolLoopAgent with 7 specialized tools:
1. `searchRelics` - Query database
2. `analyzeMedia` - Image/audio analysis
3. `categorizeRelic` - Auto-classify
4. `generateStory` - Rich narratives
5. `findRelated` - Find connections
6. `analyzeTemporalSignificance` - Future-focused analysis
7. `createRelicDraft` - Save to database

### Curator Chat (`components/curator/curator-chat.tsx`)
Multi-turn conversation interface with:
- Message history
- Image upload detection
- Real-time AI responses
- Tool execution visualization

---

## 🔌 API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/curator` | Chat with Ghost agent |
| POST | `/api/upload` | Upload media to Blob |
| POST | `/api/enhance-relic` | AI enhancement |
| POST | `/api/relics` | Create/update relics |
| POST | `/api/qr/generate` | Generate QR codes |
| GET | `/api/file` | Serve private media |
| POST | `/api/auth/callback` | Supabase auth redirect |

---

## 💾 Database Schema

### Key Tables
- **profiles** - User accounts
- **relics** - Heritage artifacts (with temporal analysis fields)
- **relic_media** - Images, audio, video
- **relic_qr_codes** - Shareable QR codes
- **curator_conversations** - Chat history
- **collections** - User-curated groups
- **collection_items** - Items in collections

**All tables include Row Level Security (RLS) for data privacy.**

**[→ Full schema details](IMPLEMENTATION_SUMMARY.md#-database-schema-supabase)**

---

## 🎨 Design System

### Colors (Chrono-Vault)
- Primary: `#FF8C00` (Hazard Amber)
- Base: `#0A0A0A` (Rich Black)
- Secondary: `#444444` (Muted Steel)
- Text: `#F5E8D8` (Warm Bone White)

### Typography
- Serif (Labels): Instrument Serif
- Sans (UI): Geist Sans
- Mono (Code): Geist Mono

### Animations
- Tap effect: Scale + glow
- Process: Pulsing fade (0→40% opacity)
- Transitions: 300-500ms easing

---

## 🔐 Security

✅ **Row Level Security**: All data protected by RLS policies
✅ **Email Verification**: Required for signup
✅ **Private Storage**: Media served via authenticated routes
✅ **Input Validation**: Zod schemas on all forms
✅ **CORS**: Configured for safe third-party access

---

## 📊 Preservation Metrics

Each relic includes:
- **Preservation Urgency**: 1-10 scale
- **Current Relevance**: Why it matters today
- **Future Importance**: Why it will matter in 50-100 years
- **Time Capsule Note**: Poetic future-focused statement

---

## 🌟 Standout Features

### Temporal Analysis
Unique AI analysis answering: "Why will this matter in 100 years?"

### Ghost Agent
Walking cartoonish AI that makes heritage preservation fun and accessible

### Time Capsule Notes
Poetic statements connecting present artifacts to future significance

### QR Integration
3 code types per relic: view, AR experience, quick contribute

### Global Community
People from all cultures can contribute and share their heritage

---

## 🚀 Future Enhancements

### Phase 2
- Community verification system
- Heritage Ambassador program
- Family tree integration

### Phase 3
- Advanced AI with video analysis
- AR museum walkthroughs
- Narrative enhancement engine

### Phase 4
- VR heritage experiences
- 3D artifact reconstruction
- Time travel visualizations

### Phase 5
- Museum partnerships
- Research APIs
- Educational programs

**[→ Full roadmap](FUTURE_IDEAS.md)**

---

## 🤝 Contributing

We welcome contributions! Areas we need help:

- [ ] Heritage data (submit new relics)
- [ ] Cultural consulting (verify accuracy)
- [ ] UI/UX feedback
- [ ] Code contributions
- [ ] Partnerships (museums, nonprofits, governments)

---

## 📚 Documentation

- **[Quickstart Guide](QUICKSTART.md)** - Setup & deployment
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Full technical details
- **[Ghost Agent Guide](GHOST_AGENT_GUIDE.md)** - How to use Ghost
- **[Future Ideas](FUTURE_IDEAS.md)** - Roadmap & enhancement concepts

---

## 🎓 How to Use

### For Heritage Enthusiasts
1. Sign up with your email
2. Explore the global relic database
3. Chat with Ghost to learn more
4. Contribute your own heritage

### For Cultural Communities
1. Create an account
2. Go to `/contribute`
3. Upload photos, audio, or video
4. Answer Ghost's questions
5. Get AI-powered preservation insights
6. Generate QR codes to share

### For Institutions
1. Contact us for institutional access
2. Integrate with your collection
3. Host exhibitions on platform
4. Connect with community

---

## 📱 Responsive Design

- **Mobile**: Touch-optimized, QR scanner, quick forms
- **Tablet**: 2-column layouts, balanced spacing
- **Desktop**: Full Bento grid, advanced features

---

## 🌍 Accessibility

- Multi-language support (50+)
- Voice-based submission
- Text-to-speech support
- Large text options
- Offline documentation tools

---

## 📞 Support

- **Issues**: GitHub Issues
- **Email**: support@reliccurator.org
- **Discord**: [Community Server]
- **Twitter**: [@RelicCurator](https://twitter.com/reliccurator)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

Built with:
- ❤️ for cultural preservation
- 🧠 by AI researchers passionate about heritage
- 🌍 for communities worldwide fighting extinction of traditions
- 🏛️ to build tomorrow's digital museums

---

## 🎯 Call to Action

**Every relic preserved is a victory for human history.**

Start your heritage preservation journey today:

👉 **[Visit Relic Curator](https://reliccurator.org)**
👉 **[Read Ghost's Guide](GHOST_AGENT_GUIDE.md)**
👉 **[Deploy Your Own](QUICKSTART.md)**

---

<div align="center">

### Preserving Yesterday | Understanding Today | Building Tomorrow

🏛️ **Relic Curator: The Chrono-Vault** ✨

*Where cultural heritage meets artificial intelligence to ensure no tradition is forgotten.*

</div>
