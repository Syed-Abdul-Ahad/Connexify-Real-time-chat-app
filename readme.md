# Connexify 🚀💬

Ever wondered how **WebSockets** work? I did too! The best way to truly understand real-time communication was to build something that brings it to life. That’s how **Connexify** was born—a real-time chat application designed to explore WebSockets while delivering a seamless and interactive messaging experience.

---

## 🌟 About Connexify

Connexify is a **real-time chat application** built using the **MERN stack** with **Socket.io** for instant messaging. It enables users to send messages, manage profiles, personalize UI settings, and securely authenticate with JWT. With a responsive UI and efficient backend, Connexify ensures a smooth, engaging communication experience.

---

## 🔥 Features

✅ **User creation & authentication** (JWT-based security)

✅ **Real-time messaging** (WebSockets with Socket.io)

✅ **Real-time file sharing** (Cloudinary integration)

✅ **UI & Theme personalization** (Daisy UI & Tailwind CSS)

✅ **Profile settings** (Manage user profiles seamlessly)

✅ **Fully responsive UI** (Optimized for all devices)

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Daisy UI
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time Communication:** Socket.io
- **Authentication:** JSON Web Tokens (JWT)
- **File Storage:** Cloudinary

---

## 🚀 Getting Started

### 📌 Prerequisites
Make sure you have the following installed on your system:
- Node.js
- MongoDB
- Git

### 📥 Installation & Setup

#### 1️⃣ Clone the repository
```bash
git clone https://github.com/Syed-Abdul-Ahad/Connexify-Real-time-chat-app.git
cd Connexify
```

#### 2️⃣ Install dependencies for both client and server
```bash
cd client
npm install
cd ../server
npm install
```

#### 3️⃣ Set up environment variables
Create a `.env` file in the `server` directory and add the required variables:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 4️⃣ Start the development server
```bash
# Start backend
cd server
npm start

# Start frontend
cd client
npm start