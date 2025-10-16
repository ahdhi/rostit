# Cleaning Roster System

A modern web application for managing weekly cleaning duties for a shared house with 7 residents.

## Features

- 📅 **4-Week Rotating Roster** - Fair distribution of cleaning duties
- 👥 **Current Week View** - See this week's assignments at a glance
- 📆 **Full Cycle View** - View all 4 weeks of the rotation
- ✅ **My Tasks** - Personal task tracking
- 🤖 **AI Assistant** - Ask questions about cleaning assignments
- 🔔 **Notification Settings** - Configure alerts and reminders
- 📱 **Calendar Sync** - Integration with Google and Apple calendars

## Tech Stack

- **Framework:** Next.js 15
- **UI:** React 19, Tailwind CSS 4
- **Components:** Radix UI, shadcn/ui
- **Package Manager:** pnpm
- **Deployment:** Netlify

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (install with `npm install -g pnpm`)

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Deployment to Netlify

### Option 1: Deploy via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Deploy:
```bash
netlify deploy --prod
```

### Option 2: Deploy via Git

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Netlify](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your Git repository
5. Configure build settings:
   - **Build command:** `pnpm run build`
   - **Publish directory:** `.next`
6. Click "Deploy site"

### Option 3: Manual Deploy

1. Build the project:
```bash
pnpm run build
```

2. Deploy using Netlify CLI:
```bash
netlify deploy --prod --dir=.next
```

## Project Structure

```
cleaning-roster-system/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # UI components (shadcn)
│   ├── ai-assistant.tsx  # AI chat interface
│   ├── my-tasks.tsx      # Task management
│   ├── week-overview.tsx # Weekly roster display
│   └── ...
├── lib/                   # Utilities and data
│   ├── roster-engine.ts  # Roster calculation logic
│   ├── types.ts          # TypeScript types & data
│   └── utils.ts          # Utility functions
└── public/               # Static assets

```

## Roster Configuration

The roster is defined in `lib/types.ts`:

- **RESIDENTS:** List of 7 residents with room assignments
- **CLEANING_AREAS:** Areas and their tasks
- **ROSTER_CYCLE:** 4-week rotation schedule

### Current Roster

- **Week 1:** Adhi & Roshna (Living), Arron & Ashwin (Kitchen), Eric & Vyshnavi (Toilet), Albert (Bathroom), Helper: Adhi
- **Week 2:** Eric & Vyshnavi (Living), Albert (Kitchen), Arron & Ashwin (Toilet), Adhi & Roshna (Bathroom), Helper: Vyshnavi
- **Week 3:** Albert (Living), Eric & Vyshnavi (Kitchen), Adhi & Roshna (Toilet), Arron & Ashwin (Bathroom), Helper: Ashwin
- **Week 4:** Arron & Ashwin (Living), Adhi & Roshna (Kitchen), Albert (Toilet), Eric & Vyshnavi (Bathroom), Helper: Roshna

## License

Private project - All rights reserved
