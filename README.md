# LifeCoach Client

LifeCoach is a community platform for creating, discovering, and sharing practical life lessons. This repository folder contains the Next.js web client and a small set of server routes for authentication and Stripe Checkout. Lesson, profile, dashboard, and admin data are provided by the separate LifeCoach API server.

## Features

- Email/password registration and sign in, plus Google sign in through Better Auth.
- Home page with a banner, featured lessons, most-saved lessons, and a weekly contributor leaderboard.
- Lesson creation, editing, detail pages, likes, favorites, comments, reports, and creator profiles.
- User dashboard with lesson and profile management.
- Admin dashboard for managing users, lessons, and reported lessons.
- Free and Premium plan presentation and Stripe Checkout subscription flow.
- Light/dark theme, responsive styling, and toast notifications.

## Tech stack

- Next.js 16 App Router and React 19
- JavaScript and TypeScript
- Tailwind CSS 4, DaisyUI, and HeroUI styles
- Better Auth with MongoDB and JWT support
- Stripe for subscriptions

## Requirements

- Node.js compatible with the installed Next.js version
- npm
- A running LifeCoach API server
- MongoDB, Better Auth / Google OAuth, and Stripe credentials for the corresponding features

## Getting started

Run these commands from the `lifecoach-client` directory:

```bash
npm install
```

Create a `.env.local` file in this directory and set the values needed by the features you want to run:

```dotenv
# Base URL for the separate LifeCoach API server (no trailing slash)
NEXT_PUBLIC_API_URL=http://localhost:5000

# Better Auth origin. Locally, this is usually the Next.js URL.
BETTER_AUTH_URL=http://localhost:3000

# MongoDB connection string used by Better Auth and the subscription success handler
MONGO_URL=mongodb://127.0.0.1:27017/lifecoach

# Google OAuth credentials (for Google sign in)
GOOGLE_CLIENT=
GOOGLE_SECRET=

# Stripe secret key (for checkout and subscription verification)
STRIPE_SECRET_KEY=
```

Update `NEXT_PUBLIC_API_URL` to match the API server's actual address. Configure the Google OAuth application with the appropriate local callback URL for Better Auth, and use Stripe test credentials while developing. Keep `.env.local` and all secret keys out of version control.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js in development mode using webpack. |
| `npm run build` | Create a production build. |
| `npm run start` | Run the production build. |
| `npm run lint` | Run ESLint. |

## App structure

```text
app/
├── (auth)/                 # Sign up and sign in pages
├── (main)/                 # Shared public layout and primary pages
│   ├── homepage/           # Home page sections, navigation, and footer
│   ├── pricing/            # Pricing and checkout success pages
│   └── components/         # Lesson, profile, user dashboard, and admin pages
├── api/
│   ├── auth/               # Better Auth Next.js handlers
│   └── checkout_sessions/  # Stripe Checkout session creation
├── lib/                    # Better Auth and Stripe setup
├── globals.css             # Tailwind, DaisyUI, and HeroUI styles
└── layout.tsx              # Root layout, theme provider, and notifications
proxy.js                    # Session checks for selected dashboard routes
```

Because the dashboard pages are nested under `app/(main)/components`, their current URLs include `/components`, for example `/components/dashboard/my-lessons` and `/components/dashboard/admin`. The `(main)` and `(auth)` names are Next.js route groups and do not appear in URLs.

## Backend connection

The client reads `NEXT_PUBLIC_API_URL` for lesson, profile, dashboard, and admin requests. The default local example above assumes the API is available at `http://localhost:5000`; start and configure that server separately. Some admin lesson actions currently call `http://localhost:5000` directly, so those actions may need the API's local URL if it differs.

The Better Auth handler is served by the Next.js app at `/api/auth`. Auth sessions and user records use the `lifecoach` MongoDB database. Stripe Checkout is created at `/api/checkout_sessions`, and successful checkout handling updates the user's plan in MongoDB.

## Notes

- The route proxy currently checks sessions on user profile, add-lesson, and admin route paths. Other protected operations should also be authorized by the API server.
- The pricing page currently contains placeholder login and Premium state values; connect these to the authenticated user's real plan before relying on the displayed access state.
- The Stripe Checkout route uses a configured Stripe Price ID in its source. Change it to the Price ID for the subscription configured in your Stripe account when needed.
