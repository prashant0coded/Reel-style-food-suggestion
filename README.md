# Reel-style Food Suggestion 🍔📱

A MERN-stack app that lets **food partners** (restaurants/vendors) upload short reel-style videos of their food, and lets **users** browse a swipeable feed, like, and save the ones they want to order.

Built with:
- **Frontend:** React 19 + Vite, React Router, Axios
- **Backend:** Node.js, Express 5, MongoDB (Mongoose)
- **Media storage:** ImageKit (for storing/serving uploaded videos)
- **Auth:** JWT stored in an HTTP-only cookie

---

## Features

- User & Food Partner registration/login (separate account types)
- Food partners can upload short food videos with a name and description
- Users can browse a feed of all food videos
- Like and save food items
- View a food partner's public profile with all their uploaded items

---

## Project Structure

```
Reel-style-food-suggestion-main/
├── backend/          # Express API + MongoDB models
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/     # ImageKit upload logic
│   │   ├── db/
│   │   └── app.js
│   ├── server.js      # Entry point (starts server on port 3000)
│   └── package.json
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── routes/
│   │   └── styles/
│   └── package.json
└── vdeos/             # Sample video assets
```

---

## Prerequisites

Before you begin, install the following on your machine:

### 1. Node.js (v18 or later recommended)
Download and install from **[nodejs.org](https://nodejs.org)** (choose the LTS version).

Verify installation:
```bash
node -v
npm -v
```

### 2. Git
Download from **[git-scm.com](https://git-scm.com)**.

Verify:
```bash
git --version
```

### 3. MongoDB
You have two options — pick one:

**Option A — MongoDB Atlas (recommended, no local install)**
1. Go to **[mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)** and create a free account.
2. Create a free **M0 cluster**.
3. Under **Database Access**, create a database user (username + password).
4. Under **Network Access**, add your current IP (or `0.0.0.0/0` for local dev/testing only).
5. Click **Connect → Drivers**, and copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<username>` and `<password>` with the database user you created. This full string is your `MONGODB_URI`.

**Option B — Local MongoDB**
1. Install from **[mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)**.
2. Start it locally (usually runs automatically as a service, or run `mongod` manually).
3. Your `MONGODB_URI` will be:
   ```
   mongodb://localhost:27017/reel-food-suggestion
   ```

### 4. ImageKit account (for video storage)
1. Sign up free at **[imagekit.io](https://imagekit.io)**.
2. After logging in, go to **Developer Options** in the left sidebar.
3. You'll find three values you need:
   - **Public Key**
   - **Private Key**
   - **URL Endpoint** (looks like `https://ik.imagekit.io/your_id`)

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/Reel-style-food-suggestion.git
cd Reel-style-food-suggestion
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a file named **`.env`** inside the `backend` folder (same level as `server.js`) with the following content:

```env
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=any_long_random_string_here
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

> 💡 `JWT_SECRET` isn't something you sign up for — just make up any long random string. You can generate one securely with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

Start the backend:
```bash
npm run dev
```

You should see:
```
[nodemon] starting `node server.js`
Server is running on port 3000
MongoDB connected
```

### 3. Frontend setup

Open a **new terminal** (keep the backend running in the first one):

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
VITE vX.X.X  ready in XXX ms
➜  Local:   http://localhost:5173/
```

> ⚠️ If port `5173` is already in use, Vite will pick another port (e.g. `5174`) — but the backend's CORS is configured for `5173` only, so requests will fail. Close whatever is using `5173` first, or update the `origin` in `backend/src/app.js` to match.

### 4. Open the app

Go to **[http://localhost:5173/](http://localhost:5173/)** in your browser (not `:3000` — that's the backend API, not the UI).

---

## Using the app for the first time

Since the database starts empty, follow this order:

1. **Register a Food Partner** → `http://localhost:5173/food-partner/register`
   (fill in business name, contact name, phone, email, password, and address — all required)
2. You'll be redirected to **Create Food** → upload a short video with a name and description
3. **Register a User** → `http://localhost:5173/user/register`
4. Go to the home feed (`/`) — you should now see the uploaded food video

---

## API Overview

All routes are prefixed with `http://localhost:3000/api`

| Method | Route | Auth required | Description |
|---|---|---|---|
| POST | `/auth/user/register` | No | Register a new user |
| POST | `/auth/user/login` | No | Log in as a user |
| GET  | `/auth/user/logout` | No | Log out a user |
| POST | `/auth/food-partner/register` | No | Register a new food partner |
| POST | `/auth/food-partner/login` | No | Log in as a food partner |
| GET  | `/auth/food-partner/logout` | No | Log out a food partner |
| POST | `/food` | Food partner | Upload a new food video |
| GET  | `/food` | User | Get all food items (feed) |
| POST | `/food/like` | User | Like/unlike a food item |
| POST | `/food/save` | User | Save/unsave a food item |
| GET  | `/food/save` | User | Get all saved food items |
| GET  | `/food-partner/:id` | User | Get a food partner's profile + their items |

Authentication is handled via an HTTP-only `token` cookie set on login/register — no need to manually pass tokens in headers.

---

## Environment Variables Reference

| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | MongoDB Atlas dashboard or your local MongoDB instance |
| `JWT_SECRET` | Any random string you generate yourself |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit dashboard → Developer Options |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit dashboard → Developer Options |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit dashboard → Developer Options |

⚠️ **Never commit your `.env` file to GitHub.** Make sure `backend/.env` is listed in `.gitignore` before pushing.

---

## Troubleshooting

| Problem | Likely cause |
|---|---|
| `net::ERR_CONNECTION_REFUSED` in browser console | Backend isn't running — start it with `npm run dev` in the `backend` folder |
| Blank page at `localhost:3000` | That's the backend port — use `localhost:5173` for the frontend |
| `401 Unauthorized` on food routes | You're not logged in yet — register/login first |
| `Missing publicKey during ImageKit initialization` | `.env` is missing or has empty ImageKit values |
| `injecting env (0) from .env` in terminal | `.env` file is empty, misnamed (check for `.env.txt`), or in the wrong folder |
| Vite runs on `5174` instead of `5173` | Something else is already using `5173` — free it up or update backend CORS |
| "Registration failed" with no specific reason | Double check all required fields are filled; check backend terminal for the real error |

---

## License

This project currently has no license specified. Add one (e.g. MIT) if you plan to open-source it publicly.
