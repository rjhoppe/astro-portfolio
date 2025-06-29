# astro-portfolio

A modern, full-stack portfolio website built with Astro, featuring a blog, projects showcase, and interactive gift registry system.

## 🚀 Features

- ✅ **Full-Stack Astro Application** - Server-side rendering with Node.js adapter
- ✅ **Authentication System** - GitHub OAuth integration with Arctic
- ✅ **Database Integration** - SQLite with Drizzle ORM and automatic migrations
- ✅ **Blog & Projects** - MDX-powered content with syntax highlighting
- ✅ **Modern UI** - Tailwind CSS with responsive design and dark/light themes
- ✅ **Performance Optimized** - Lighthouse 100/100 scores
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **Testing** - Vitest with React Testing Library
- ✅ **Code Quality** - ESLint, Prettier, and Husky pre-commit hooks
- ✅ **Monitoring** - Sentry integration for error tracking and performance monitoring
- ✅ **Docker Support** - Multi-stage builds with production and local development setups
- ✅ **CI/CD** - GitHub Actions with automated testing and deployment

## 🛠️ Tech Stack

- **Frontend**: Astro, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, SQLite, Drizzle ORM
- **Authentication**: Arctic (GitHub OAuth)
- **Email**: Resend
- **Monitoring**: Sentry
- **Testing**: Vitest, React Testing Library
- **Deployment**: Docker, GitHub Actions
- **Database**: SQLite with Drizzle migrations

## 📋 Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Docker (for containerized deployment)

## 🚀 Quick Start

### Local Development

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd astro-portfolio
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:

   ```env
   PUBLIC_GIFTS_PASSWORD=your_gifts_password
   AUTH_TRUST_HOST=your_domain
   AUTH_SECRET=your_auth_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   RESEND_API_KEY=your_resend_api_key
   EMAIL_ADDRESS=your_email
   ASTRO_TELEMETRY_DISABLED=1
   SENTRY_AUTH_TOKEN=your_sentry_auth_token
   PUBLIC_SENTRY_DSN=your_public_sentry_dsn
   ```

4. **Run database migrations**

   ```bash
   pnpm run migrate
   ```

5. **Start development server**
   ```bash
   pnpm run dev
   ```

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build locally
./local_build.sh
```

## 💻 Available Commands

| Command                    | Action                                       |
| :------------------------- | :------------------------------------------- |
| `pnpm install`             | Installs dependencies                        |
| `pnpm run dev`             | Starts local dev server at `localhost:4321`  |
| `pnpm run dev:network`     | Starts local dev server on local network     |
| `pnpm run build`           | Build your production site to `./dist/`      |
| `pnpm run preview`         | Preview your build locally, before deploying |
| `pnpm run preview:network` | Preview build on local network               |
| `pnpm run lint`            | Run ESLint                                   |
| `pnpm run lint:fix`        | Auto-fix ESLint issues                       |
| `pnpm run test`            | Run test suite                               |
| `pnpm run generate`        | Generate database migrations                 |
| `pnpm run migrate`         | Run database migrations                      |

## 📁 Project Structure

```
astro-portfolio/
├── src/
│   ├── components/          # Astro and React components
│   ├── content/             # Blog posts and project markdown
│   ├── layouts/             # Page layouts
│   ├── lib/                 # Utility functions and server logic
│   ├── models/              # Database schema and types
│   ├── pages/               # Astro pages and API routes
│   └── styles/              # Global styles
├── drizzle/                 # Database migrations
├── public/                  # Static assets
├── src/__tests__/           # Test files
├── Dockerfile               # Production Docker build
├── local.Dockerfile         # Local development Docker build
└── docker-compose.yaml      # Docker Compose configuration
```

## 🔧 Configuration

### Authentication

- GitHub OAuth integration via Arctic
- Session management with secure cookies
- Protected admin routes

### Database

- SQLite database with Drizzle ORM
- Automatic migrations on startup
- Persistent data storage in Docker volumes

### Email Notifications

- Resend integration for gift registry notifications
- HTML email templates
- Rate limiting on email endpoints

### Monitoring

- Sentry integration for error tracking
- Performance monitoring
- Session replay capabilities

## 🧪 Testing

The project includes comprehensive tests:

- Component testing with React Testing Library
- API route testing
- Utility function testing
- Database operation testing

Run tests with:

```bash
pnpm run test
```

## 📊 Performance

- Lighthouse 100/100 performance score
- Optimized images and assets
- Efficient database queries
- Minimal bundle size

## 🔒 Security

- Non-root Docker containers
- Environment variable protection
- Rate limiting on API endpoints
- Secure session management
- Input validation and sanitization

## 🚀 Deployment

### GitHub Actions

Automated CI/CD pipeline includes:

- Linting and testing
- Docker image building
- Container deployment to Portainer
