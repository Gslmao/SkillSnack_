## SkillSnack Backend (Express + Supabase Auth)

This is a small Express server that exposes API endpoints for Supabase Auth.

### Setup

- **Install dependencies**

```bash
cd backend
npm install
```

- **Configure environment**

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Fill in:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CORS_ORIGIN` (e.g. `http://localhost:3000`)
- `PORT` (optional, defaults to `4000`)

### Scripts

- **Development**

```bash
npm run dev
```

- **Production**

```bash
npm start
```

### Endpoints

Base URL: `http://localhost:4000`

- **Health check**
  - `GET /health`

- **Sign up**
  - `POST /auth/signup`
  - Body: `{ "email": string, "password": string }`
  - Returns: `{ user, session }` or `{ error }`

- **Login**
  - `POST /auth/login`
  - Body: `{ "email": string, "password": string }`
  - Returns: `{ user, session }` or `{ error }`

- **Refresh session**
  - `POST /auth/refresh`
  - Body: `{ "refresh_token": string }`
  - Returns: `{ user, session }` or `{ error }`

- **Current user**
  - `GET /auth/me`
  - Headers: `Authorization: Bearer <access_token>`
  - Returns: `{ user }` or `{ error }`

- **Logout**
  - `POST /auth/logout`
  - Note: This is stateless; the client should discard stored tokens.

