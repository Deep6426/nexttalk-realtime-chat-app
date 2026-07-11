# 🚀 NexTalk - Real-Time Chat Application

A full-stack real-time chat application built with **Next.js**, **TypeScript**, **Socket.IO**, **MongoDB Atlas**, and **Tailwind CSS**. Users can sign up, log in, chat instantly, view online users, and access previous conversations.

---

## 🌐 Live Demo

🔗 https://nexttalk-realtime-chat-app-production.up.railway.app/login

---

## ✨ Features

- 🔐 User Authentication (Signup & Login)
- 💬 Real-time messaging using Socket.IO
- 🟢 Online user status
- 💾 Persistent chat history with MongoDB Atlas
- 📱 Responsive UI
- ⚡ Fast Next.js App Router architecture
- ☁️ Deployed on Railway

---

## 🛠️ Tech Stack

### Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- Express.js
- Socket.IO
- MongoDB Atlas
- Mongoose

### Deployment
- Railway
- MongoDB Atlas

---

## 📂 Project Structure

```
nexttalk-realtime-chat-app/
│
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── models/
│
├── socket-server/
│
├── package.json
├── server.js
└── README.md
```

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/Deep6426/nexttalk-realtime-chat-app.git
```

Move into the project

```bash
cd nexttalk-realtime-chat-app
```

Install dependencies

```bash
npm install
```

Start the Next.js application

```bash
npm run dev
```

Start the Socket.IO server

```bash
node server.js
```

---

## 🔑 Environment Variables

Create a `.env.local` file and add:

```env
MONGODB_URI=your_mongodb_connection_string

NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

---

## 📸 Screenshots

### Login Page

(Add Screenshot)

### Chat Page

(Add Screenshot)

---

## 📌 Future Improvements

- Typing indicator
- Read receipts
- Image sharing
- Emoji support
- Group chats
- Voice & Video calls

---

## 👨‍💻 Author

**Diptanshu Raut**

GitHub: https://github.com/Deep6426

---

## 📜 License

This project is for educational and internship purposes.
