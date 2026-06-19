# Kemari — AI for Smart Tourism Experience

Platform ulasan wisata berbasis AI yang menganalisis sentimen dari **55.150+ ulasan** Google Maps & TikTok menggunakan **IndoBERT ABSA** (Aspect-Based Sentiment Analysis).

> **Live:** [kemari-pjk.vercel.app](https://kemari-pjk.vercel.app)  
> **Tim:** PJK-GM043 · Pijak × IBM SkillsBuild

---

## Features

### Public
| Page | Description |
|---|---|
| `/` | Landing page — hero, top recommendations, features, city tabs, FAQ, CTA |
| `/wisata` | Explore destinations — search, filter (city, category, sort), pagination |
| `/wisata/[slug]` | Destination detail — hero carousel, 5 aspect scores, AI ringkasan, review quotes |
| `/login` | User login/register — email/password + Google OAuth |
| `/profile` | User profile — stats, review history |

### Admin (`/admin`)
| Page | Description |
|---|---|
| `/admin/dashboard` | Stats overview — total destinations, reviews, cities |
| `/admin/destinasi` | Manage destinations — search, table with edit links |
| `/admin/destinasi/[id]/edit` | Edit destination — upload photos (Cloudinary), edit description |
| `/admin/pengaturan` | Settings — upload website logo |

### API
| Endpoint | Description |
|---|---|
| `GET /api/tempat` | Paginated destinations with filters (`q`, `kota`, `kategori`, `sort`) |
| `GET /api/tempat/[slug]` | Full destination detail with aspect scores + sentiment |
| `GET /api/tempat/[slug]/ulasan` | Paginated reviews with source filter |
| `GET /api/rekomendasi` | Ranked recommendations by city/aspect |
| `GET /api/wisata/autocomplete?q=...` | Search autocomplete (min 3 chars, max 5 results) |
| `GET /api/kota` | Cities with destination count |
| `GET /api/health` | Health check — DB + ML status |
| `POST /api/auth/register` | Email/password registration |
| `POST /api/admin/tempat/[id]/upload` | Cloudinary photo upload (admin only) |
| `PATCH /api/admin/tempat/[id]` | Update destination description/publish (admin only) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Prisma 7 |
| **Auth** | NextAuth.js v4 (Google OAuth + Credentials) |
| **Styling** | Tailwind CSS · Dark/light mode (next-themes) |
| **Animation** | Framer Motion |
| **Images** | Cloudinary |
| **ML API** | IndoBERT ABSA (Hugging Face Spaces) |
| **Deployment** | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── (public pages)     # Home, Explore, Detail, Login, Profile
│   ├── admin/             # Admin dashboard, destinasi, settings
│   └── api/               # REST API routes
├── components/
│   ├── ui/                # Buttons, Cards, Badges, Pagination, Input
│   ├── layout/            # Navbar, Footer, Logo
│   ├── destination/        # HeroCarousel, DetailSections, DestinationCard
│   ├── review/            # ReviewCard, ReviewFilter
│   ├── recommendation/    # RecommendationSection
│   └── home/              # HeroSection, Features, FAQ, CityTabs, CTA
├── lib/                   # Auth, Prisma, Logger, Cache, Rate-limit, Errors
├── repositories/          # Database access layer (5 modules)
├── services/              # Business logic layer
├── providers/             # ThemeProvider, SessionProvider
├── adapters/ml/           # ML API adapter
├── types/                 # TypeScript DTOs
├── constants/             # Predikat thresholds, aspect colors
└── utils/                 # Slugify, getPredikat, formatting
scripts/                   # ETL pipeline, data generation, admin tools
prisma/                    # Schema & migrations
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)

### Setup
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Fill in DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.

# Push database schema
npx prisma db push

# Seed destinations + reviews
npm run ingest data/dataset_labeled_web.csv

# Generate descriptions + images
npx tsx scripts/gen-descriptions.ts

# Start dev server
npm run dev
```

### Environment Variables
```env
DATABASE_URL=
DIRECT_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ML_SERVICE_URL=
```

---

## Test Accounts

| Role | Email | Password |
|---|---|---|
| User | `user@kemari.id` | `user123` |
| Admin | `admin@kemari.id` | `admin123` |

Login at `/login`. Admin access at `/admin`.

---

## Data Pipeline

```bash
# ETL: Import labeled CSV to database
npm run ingest data/dataset_labeled_web.csv

# Auto-categorize destinations
npx tsx scripts/set-kategori.ts

# Generate descriptions + placeholder images
npx tsx scripts/gen-descriptions.ts

# Recalculate scores (average of 5 aspects)
npx tsx scripts/fix-skor.ts

# Create test users
npx tsx scripts/create-test-users.ts
```

---

## Deployment

Connected to Vercel via GitHub. Every push to `master` triggers auto-deploy.

```bash
git push origin master
```

---

## License

Internal — PJK-GM043 Capstone Project
