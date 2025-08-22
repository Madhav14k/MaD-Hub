# 📸 Screenshots

Screenshots of the app in action (located in `frontend/public/screenshots/`):

### Dashboard
![Dashboard](frontend/public/screenshots/Screenshot%202025-08-22%20225126.png)

### Kanban Board
![Kanban Board](frontend/public/screenshots/Screenshot%202025-08-22%20225143.png)

### Task Details Dialog
![Task Details](frontend/public/screenshots/Screenshot%202025-08-22%20225229.png)
# MaD-Hub: Collaborative Project Tracker

## 🚀 Tech Stack

- **Frontend:** React (Vite), Material UI, @hello-pangea/dnd, Axios, Socket.IO-client
- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL (Supabase), JWT, bcrypt, CORS, dotenv, Swagger (yamljs), Socket.IO
- **Deployment:** Render (frontend & backend), Supabase (PostgreSQL)

---

## 🛠️ Setup & Run Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm
- PostgreSQL (Supabase or local)

### 1. Clone the Repository
```
git clone https://github.com/Madhav14k/MaD-Hub.git
cd MaD-Hub
```

### 2. Backend Setup
```
cd backend
cp .env.example .env  # Or create .env and fill in your DB credentials
npm install
npx prisma generate
npx prisma migrate deploy  # Or npx prisma migrate dev for local
npm run start
```
- The backend runs on `http://localhost:5000` by default.

### 3. Frontend Setup
```
cd ../frontend
cp .env.example .env  # Or create .env and set VITE_API_URL to your backend URL
npm install
npm run dev
```
- The frontend runs on `http://localhost:5173` by default.

### 4. Deployment
- Deploy both frontend and backend to [Render](https://render.com/).
- Set all environment variables in the Render dashboard as described above.
- For the frontend, set `VITE_API_URL` to your Render backend URL.

---

## 📚 API Documentation

### Swagger UI
- The backend exposes Swagger API docs at:
	- `https://mad-hub-backend-wz7g.onrender.com/api-docs`
- You can view and test all endpoints there.

### Postman Collection
- Import the OpenAPI/Swagger JSON from `/backend/swagger.yaml` into Postman for testing.

---

## 📝 Notes
- For real-time features, ensure both frontend and backend are deployed and accessible.
- For file uploads, configure cloud storage keys in the backend `.env` if needed.

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
[MIT](LICENSE)
