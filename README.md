# GrowTrack

**🌱 Track habits. Set goals. Grow daily.**

A full-stack Progressive Web App for habit tracking, goal setting, and mood logging with AI-powered analytics.

**Built by:** Glory Tigga | BCA 6th Year | Pandu College

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (habits/goals/moods) + MySQL (users/subscriptions) |
| **Auth** | JWT (Access + Refresh tokens), bcrypt |
| **Charts** | Chart.js |
| **PDF Export** | jsPDF + html2canvas |
| **PWA** | Service Worker, Web Manifest, Offline fallback |
| **Payments** | Stripe (Sandbox mode) |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas: `mongodb://localhost:27017`)
- MySQL (local or remote)

### Setup

```bash
# 1. Clone & enter project
cd growtrack

# 2. Install server dependencies
cd server
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 4. Start the server
npm run dev
# → Server: http://localhost:5000
# → Client: http://localhost:5000 (served by Express)
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/growtrack` |
| `MYSQL_HOST` | MySQL host | `localhost` |
| `MYSQL_USER` | MySQL user | `root` |
| `MYSQL_PASSWORD` | MySQL password | *(empty)* |
| `MYSQL_DATABASE` | MySQL database name | `growtrack` |
| `JWT_SECRET` | JWT signing secret | *(set in .env)* |
| `PAYMENT_MODE` | `sandbox` or `production` | `sandbox` |

## Features

### Client Panel
- ✅ **Dashboard** — Overview with stat cards, growth score gauge, quick mood logger, today's habits
- ✅ **Habits** — CRUD with streak tracking, daily completion toggle, color picker, progress bars
- ✅ **Goals** — CRUD with progress slider, milestone tracking, deadline countdown, categories
- ✅ **Mood Logger** — 1-5 emoji selector, notes, tags, mood stats & trends
- ✅ **Reports** — Growth score, habit performance charts, mood trend line, PDF export
- ✅ **Settings** — Profile edit, dark/light theme toggle, data export
- ✅ **Upgrade** — 3-tier pricing (Free/Pro/Team) with sandbox payment

### Admin Panel
- ✅ **Dashboard** — KPI cards (users, revenue), plan distribution chart, audit logs
- ✅ **User Management** — Search, filter, suspend/activate/delete users
- ✅ **System Metrics** — Activity overview charts

### Growth Score Algorithm
```
Growth Score = (Habit Consistency × 0.5) + (Mood Stability × 0.3) + (Streak Bonus × 0.2)

Where:
  Habit Consistency = (Completed / Target) × 100
  Mood Stability = 100 - (StdDev(mood_scores) × 10)
  Streak Bonus = min(10, max_streak) × 10
```

### PWA Features
- 📱 Installable on desktop & mobile
- 📡 Offline fallback page
- 🔄 Service Worker with cache-first (static) and network-first (API)
- 💾 Background sync support for offline data

### Security
- 🔐 bcrypt password hashing (12 rounds)
- 🔑 JWT Access (15min) + Refresh (7d) tokens
- 🛡️ Helmet security headers
- 🚦 Rate limiting (auth: 10/15min, API: 500/hr)
- ✅ Input validation with express-validator
- 👮 Role-based access control (RBAC)

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/login` | Sign in |
| POST | `/api/v1/auth/refresh` | Refresh token |
| GET | `/api/v1/auth/me` | Get profile |
| PUT | `/api/v1/auth/profile` | Update profile |

### Habits
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/habits` | List habits |
| POST | `/api/v1/habits` | Create habit |
| PUT | `/api/v1/habits/:id` | Update habit |
| DELETE | `/api/v1/habits/:id` | Delete habit |
| POST | `/api/v1/habits/:id/log` | Log daily completion |

### Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/goals` | List goals |
| POST | `/api/v1/goals` | Create goal |
| PUT | `/api/v1/goals/:id` | Update goal |
| PUT | `/api/v1/goals/:id/progress` | Update progress |
| DELETE | `/api/v1/goals/:id` | Delete goal |

### Moods
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/moods` | Log mood |
| GET | `/api/v1/moods` | History |
| GET | `/api/v1/moods/stats` | Statistics |
| GET | `/api/v1/moods/today` | Today's mood |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/reports/dashboard-summary` | Dashboard data |
| GET | `/api/v1/reports/growth-score` | Growth score |
| GET | `/api/v1/reports/weekly` | Weekly report |
| GET | `/api/v1/reports/monthly` | Monthly report (Pro) |
| GET | `/api/v1/reports/correlation` | Mood-habit correlation (Pro) |

### Admin (requires admin role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/users` | List users |
| PUT | `/api/v1/admin/users/:id/suspend` | Suspend user |
| PUT | `/api/v1/admin/users/:id/activate` | Activate user |
| DELETE | `/api/v1/admin/users/:id` | Delete user |
| GET | `/api/v1/admin/analytics` | System analytics |
| GET | `/api/v1/admin/audit-logs` | Audit logs |

## Folder Structure

```
growtrack/
├── server/                    # Backend (Node.js + Express)
│   ├── server.js              # Entry point
│   ├── config/                # DB connections + app config
│   ├── middleware/             # Auth, RBAC, validation, errors
│   ├── models/mysql/          # Sequelize models (users, subs, payments)
│   ├── models/mongo/          # Mongoose models (habits, goals, moods)
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic (growth score, correlation)
│   └── routes/                # API routes (grouped by domain)
├── client/                    # Frontend (Vanilla JS PWA)
│   ├── index.html             # SPA shell
│   ├── manifest.json          # PWA manifest
│   ├── service-worker.js      # Cache + offline
│   ├── css/index.css          # Design system
│   └── js/                    # Modules (app, auth, habits, etc.)
└── docs/                      # Academic documentation
```

## Freemium Tiers

| Feature | Free | Pro ($2.99/mo) | Team ($4.99/user/mo) |
|---------|------|----------------|---------------------|
| Habits | 3 | Unlimited | Unlimited |
| Goals | 1 | Unlimited | Unlimited |
| Mood Tracking | Basic | Full | Full |
| Weekly Reports | ✅ | ✅ | ✅ |
| Monthly Reports | ❌ | ✅ | ✅ |
| Correlation Analytics | ❌ | ✅ | ✅ |
| PDF Export | ❌ | ✅ | ✅ |
| Admin Dashboard | ❌ | ❌ | ✅ |

## License

MIT
