<<<<<<< HEAD
# 🪶 Plume Post

A full-stack MERN blog platform with JWT authentication, a rich-text editor, image uploads, and author profiles.

**Live demo:** https://plumepost.netlify.app/

## Features

- User registration and login with JWT-based authentication
- Global auth state managed via React Context API
- Create, edit, and delete blog posts with a rich-text editor
- Image uploads for profile pictures and post thumbnails
- Author profile pages
- RESTful API built with Express and MongoDB

## Tech Stack

**Frontend:** React, Context API, CSS
**Backend:** Node.js, Express, MongoDB, JWT
**Deployment:** Netlify (client) + Render (server)

## Project Structure

```
Plume-Post-MERN-/
├── client/   # React frontend
└── server/   # Express + MongoDB backend
```

## Getting Started

### Prerequisites

- Node.js installed
- A MongoDB connection string (local or Atlas)

### 1. Clone the repo

```bash
git clone https://github.com/Mahanand2001/Plume-Post-MERN-.git
cd Plume-Post-MERN-
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file in `server/` with the variables your backend expects (e.g. `MONGO_URI`, `JWT_SECRET`, `PORT`).

```bash
npm start
```

### 3. Set up the client

```bash
cd ../client
npm install
```

Create a `.env` file in `client/` with:

```
REACT_APP_BASE_URL=http://localhost:<your-server-port>
REACT_APP_ASSETS_URL=http://localhost:<your-server-port>/uploads
```

```bash
npm start
```

The app should now be running locally, with the client talking to your local server.

## Notes on Image Uploads

This project stores uploaded profile images and post thumbnails on the local filesystem rather than in MongoDB, to keep the database lightweight and API responses fast.

⚠️ Because Render's free tier does not provide a persistent filesystem, uploaded images on the live deployment will be wiped whenever the server instance restarts. Running the project locally does not have this limitation — uploads persist normally in the `uploads/` folder.

## Deployment

- **Frontend:** deployed on [Netlify](https://www.netlify.com/)
- **Backend:** deployed on [Render](https://render.com/)

## License

This project currently has no license specified. Feel free to open an issue if you'd like to suggest one.

## Author

**Mahanand2001** — [GitHub](https://github.com/Mahanand2001)
=======
