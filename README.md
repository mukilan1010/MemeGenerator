# Meme Generation Web App 🖼️🔥

## 👨‍💻 Developed by: Mukilan N 


---

## 📌 Project Overview

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application that allows users to generate, customize, and manage memes in a secure and interactive environment.

Users can log in, select from top meme templates, add text, draw, upload images, and save their creations to their dashboard — complete with **version history**, **profile**, and **re-editing** capabilities.

---

## 🌟 Features

### 🔐 Authentication:
- User **signup and login**
- **JWT-based** authentication
- Passwords hashed using **bcrypt**
- Protected routes and session persistence

### 🖼️ Meme Editor:
- Top templates from **Imgflip API**
- Add **top and bottom text**
- Draw directly on the meme using **Canvas API**
- **Upload and overlay** custom images
- Save, download, and revert to previous meme versions

### 📋 User Dashboard:
- View and update profile info
- View **saved memes**
- Re-edit or download past memes

### 🧠 Extra Capabilities:
- 🔄 **Meme version history** (users can revert to older versions)
- 📤 Plan to add **real-time collaboration**
- 📣 Plan to add **social sharing** for memes

---

## 🚀 Deployed Link
🔗 [Live App](https://meme-generator-lime-phi.vercel.app/)

## 💻 GitHub Repository
🔗 [GitHub](https://github.com/mukilan1010/MemeGenerator)

---

## 🧱 Tech Stack

| Layer       | Tech Used                          |
|-------------|------------------------------------|
| Frontend    | React.js, React Router, Axios, Canvas API |
| Backend     | Node.js, Express.js                |
| Database    | MongoDB + Mongoose                 |
| Auth        | JWT, bcrypt                        |
| Hosting     | Vercel (Frontend), Render (or similar for backend) |

---

## 📁 Folder Structure
MukilanN_SoftwareDeveloper/
├── MemeGenerator/             → Main project folder
│   ├── frontend/              → React app (login, signup, meme editor, dashboard)
│   ├── backend/               → Node.js + Express backend
│   └── README.md              → 📄 Project documentation and setup guide (now inside this folder)
├── CoverNote.pdf              → 📄 Approach, features, challenges, links


---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/mukilan1010/MemeGenerator.git
cd MemeGenerator

2. Setup backend

cd backend
npm install
# Create .env with JWT_SECRET and MongoDB URI
npm start

3. Setup frontend


cd ../frontend
npm install
npm run dev



🧩 Challenges Faced
Implementing canvas drawing and layering features

Managing image uploads and text overlay simultaneously

Ensuring JWT security and protected routes

Handling asynchronous state updates in React

Building version history logic for memes


📌 Future Improvements
🧑‍🤝‍🧑 Real-time collaboration on meme editing

📲 One-click social sharing (Instagram, WhatsApp, etc.)

🧩 Tagging, categorization, and public meme feed

🔍 Advanced search and filters for user dashboard