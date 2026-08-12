# Verdikt

Verdikt is a collaborative peer-review and feedback platform for creative work. Users can submit projects, receive judgments from peers, track scores, and view public performance insights through a leaderboard and feedback dashboard.

The project is built as a full-stack application with:

- Frontend: React + Vite + Tailwind CSS
- Backend: Express + Node.js + MongoDB
- Real-time tasks: Socket.IO and cron-based unlock jobs
- Media uploads: Cloudinary

## GitHub Pages Deployment

This project is designed to be hosted on GitHub Pages for the frontend.

- The React client can be deployed directly on GitHub Pages
- The backend API must remain separate because GitHub Pages cannot host a Node.js/Express server
- The frontend connects to the live backend through the `VITE_API_URL` environment variable

> This project is not intended for Vercel, Netlify, or other full-stack hosting in this setup. The deployment target is GitHub Pages for the frontend only.

## Features

- User signup and authentication
- Submission intake for text, URLs, and image-based work
- Judge queue and review workflow
- Weighted scoring and computation of aggregated merit
- Feedback reveal after completion
- Leaderboard tracking for user performance
- Profile analytics and activity history
- Secure API auth using JWT

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide icons

### Backend
- Node.js
- Express 5
- MongoDB with Mongoose
- JWT authentication
- Cloudinary uploads
- Socket.IO
- cron scheduling

## Project Structure

```text
verdikt/
├── client/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md (optional, if you want front-end-only docs)
├── server/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── server.js
│   ├── unlockjob.js
│   ├── wipe.js
│   └── package.json
├── .gitignore
├── README.md
└── package.json (optional workspace config if added later)
```

## Prerequisites

Before running the app locally, make sure you have:

- Node.js 18+ and npm
- MongoDB running locally or a MongoDB Atlas connection string
- A Cloudinary account for image uploads

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/verdikt.git
cd verdikt
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside `server/`:

```env
MONGOURI=mongodb://localhost:27017/verdikt
PORT=5000
```

If you are using MongoDB Atlas, use your connection string instead.

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Run the backend

```bash
cd server
node server.js
```

The backend will start on the configured port (default: `5000`).

### 6. Run the frontend

```bash
cd client
npm run dev
```

Then open the local Vite URL, usually:

```text
http://localhost:5173
```

## Production Build

Build the frontend for production:

```bash
cd client
npm run build
```

The output is generated in:

```text
client/dist/
```

If you are deploying the full-stack app on a Node server instead of separating frontend/backend, the Express server in `server/server.js` already serves the static build from `../client/dist`.

## Deployment Guide

### GitHub Pages deployment for the frontend

This repository is set up for GitHub Pages hosting of the frontend app.

#### 1. Build the frontend

```bash
cd client
npm install
npm run build
```

#### 2. Deploy to GitHub Pages

Use one of these options:

- GitHub repository settings → Pages → Source: GitHub Actions
- Or push the built `client/dist` output to a Pages branch if you prefer a static branch workflow

This project includes a GitHub Actions workflow for deployment at:

```text
.github/workflows/deploy-pages.yml
```

#### 3. Set the frontend API URL

Before building for production, set the live backend URL:

```env
VITE_API_URL=(https://verdikt-1.onrender.com)
```

This is required so the frontend can authenticate and call the API when deployed on GitHub Pages.

#### 4. GitHub Pages base path

If your repository is published under a project path such as `https://username.github.io/verdikt/`, add a base path in `vite.config.js`:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/verdikt/',
  plugins: [react()],
})
```

If you use a custom domain or a root project page, you may set `base: '/'` instead.

### Backend hosting

The backend must be hosted separately from GitHub Pages because GitHub Pages does not support Node.js server execution.

Recommended setup:

- Host the Express API on any Node-capable platform
- Keep MongoDB in MongoDB Atlas
- Point the frontend to the deployed backend URL through `VITE_API_URL`

#### Example backend environment variables

```env
MONGOURI=mongodb+srv://<username>:<password>@cluster.mongodb.net/verdikt
PORT=5000
JWTSECRET=your-secret-key
```

#### Example frontend environment variables for GitHub Pages

```env
VITE_API_URL=https://your-backend-url.com/api
```

## GitHub Pages setup checklist

Before publishing:

- ensure the client build succeeds with `npm run build`
- set GitHub repository Pages source to GitHub Actions
- add the production `VITE_API_URL` value in repository secrets if using the workflow
- verify the repo base path matches the live GitHub Pages URL
- keep the backend running at the API URL you configured

## Suggested Environment Template

You can create these example files for contributors:

### `server/.env.example`

```env
MONGOURI=mongodb://localhost:27017/verdikt
PORT=5000
JWTSECRET=replace-with-your-secret-key

CLOUDINARYNAME=your-cloudinary-name
CLOUDINARYAPIKEY=your-cloudinary-api-key
CLOUDINARYAPISECRET=your-cloudinary-api-secret
```

### `client/.env.example`

```env
VITE_API_URL=http://localhost:5000/api
```

## GitHub Repository Best Practices

To keep the repository clean and deployment-friendly:

- Keep `.env` files out of Git history
- Add `.env.example` files if you want contributors to copy from a template
- Use a proper `.gitignore` to exclude build output and local secrets
- Document environment variables clearly in this README
- Keep frontend and backend dependency installation separated

## Suggested Environment Template

You can create these example files for contributors:

### `server/.env.example`

```env
MONGOURI=mongodb://localhost:27017/verdikt
PORT=5000
```

### `client/.env.example`

```env
VITE_API_URL=http://localhost:5000/api
```

## Common Commands

### Frontend

```bash
cd client
npm install
npm run dev
npm run build
npm run preview
```

### Backend

```bash
cd server
npm install
node server.js
```

## Notes

- The app depends on a backend API for authentication, submissions, judgments, and leaderboard logic.
- GitHub Pages cannot host the Node server directly.
- For production, use a separate hosting setup for the backend and keep the frontend configured to call the live API.

## License

This project is currently unlicensed unless you add a license file. For open-source projects, it is recommended to add a license such as MIT.

```bash
# Example:
# npm init -y
# npx license mit
```

## Contributing

Contributions are welcome. If you want to improve the app:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## Contact

If you are maintaining this project, add your contact details here or link to your portfolio, GitHub profile, or project page.
