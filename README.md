# Verdikt

Verdikt is a collaborative peer-review and feedback platform for creative work. Users can submit projects, receive judgments from peers, track scores, and view public performance insights through a leaderboard and feedback dashboard.

The project is built as a full-stack application with:

- Frontend: React + Vite + Tailwind CSS
- Backend: Express + Node.js + MongoDB
- Real-time tasks: Socket.IO and cron-based unlock jobs
- Media uploads: Cloudinary

## GitHub Pages Deployment

This project is deployed with the following live setup:

- Frontend: GitHub Pages
- Backend API: Render
- Database: MongoDB Atlas

Live frontend URL:

```text
https://ayush-mg.github.io/verdikt/
```

The frontend connects to the live backend through the `VITE_API_URL` environment variable.

> This setup is built for GitHub Pages on the frontend and Render for the backend.

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
│   └── README.md
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
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
├── .gitignore
├── README.md
└── package.json
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
JWTSECRET=replace-with-your-secret-key

CLOUDINARYNAME=your-cloudinary-name
CLOUDINARYAPIKEY=your-cloudinary-api-key
CLOUDINARYAPISECRET=your-cloudinary-api-secret
```

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

## Deployment Guide

This app is designed to use the following production setup:

- Frontend: GitHub Pages
- Backend API: Render
- Database: MongoDB Atlas

### 1. Deploy the backend on Render

Use Render with the backend folder as the app root:

- Root Directory: `server`
- Build Command:

```bash
npm install
```

- Start Command:

```bash
npm start
```

Set the backend environment variables:

```env
MONGOURI=mongodb+srv://<username>:<password>@cluster.mongodb.net/verdikt
PORT=10000
JWTSECRET=your-secret-key
CLOUDINARYNAME=your-cloudinary-name
CLOUDINARYAPIKEY=your-cloudinary-api-key
CLOUDINARYAPISECRET=your-cloudinary-api-secret
```

After deployment, Render will give you a public API URL such as:

```text
https://verdikt-1.onrender.com
```

### 2. Set the frontend API URL

The frontend must use the live backend URL:

```env
VITE_API_URL=https://verdikt-1.onrender.com/api
```

This is required so the React app can authenticate and call the API when hosted on GitHub Pages.

### 3. Deploy the frontend to GitHub Pages

This project includes a GitHub Actions workflow for deployment at:

```text
.github/workflows/deploy-pages.yml
```

In GitHub, go to:

- Repository → Settings → Pages
- Source → GitHub Actions

Then add a repository secret named:

```text
VITE_API_URL
```

with the value:

```text
https://verdikt-1.onrender.com/api
```

### 4. GitHub Pages base path

If your repo is `username/verdikt`, add a base path in `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/verdikt/',
  plugins: [react(), tailwindcss()],
})
```

If your site is on a custom domain or root URL, use `base: '/'` instead.

## Final deployment checklist

This project is successfully deployed in production:

- backend is live on Render
- MongoDB Atlas is connected
- the Render API URL is configured as `VITE_API_URL`
- GitHub Pages is enabled with GitHub Actions
- the frontend build succeeds with `npm run build`
- live frontend is available at https://ayush-mg.github.io/verdikt/

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
