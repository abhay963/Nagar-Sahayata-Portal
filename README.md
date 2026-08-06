<div align="center">

# 🏙️ Nagar-Sahayata-Portal
### Smart Civic Complaint Management System

A modern full-stack platform that empowers citizens to report local civic issues and enables authorities to efficiently track, assign, and resolve complaints.

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Framework-Express-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge)](https://jwt.io/)
[![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)]()

## 🌐 Live Demo

**Frontend (Vercel):** [https://nagar-sahayata-portal.vercel.app/](https://nagar-sahayata-portal.vercel.app/)

</div>

---

## 📖 Project Overview

**Nagar-Sahayata-Portal** is a full-stack civic engagement platform designed to bridge the gap between citizens and local authorities. Citizens can easily report issues such as road damage, water leakage, garbage, street lights, and other civic problems with photos and location details.

Authorities manage the entire complaint lifecycle through **role-based dashboards**:

- 👤 **Citizen (User)** — Submit complaints with images & location  
- 🛠️ **Staff / Junior Staff** — View, accept, update progress & resolve assigned complaints  
- 🧑‍💼 **Admin / Department Head** — Monitor all reports, assign tasks, and oversee operations  

Built with the **MERN Stack**, the platform features secure JWT authentication, real-time status tracking, email notifications, and a modern responsive UI.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-Based Access Control (User, Staff, Junior Staff, Admin)
- Protected routes and role-specific dashboards

### 📢 Complaint Management
- Submit complaints with description, category, priority & images
- Location-based reporting
- Status flow: **Pending → Staff Assigned → In-Progress → Resolved**
- Image upload support

### 🛠️ Staff & Junior Staff Features
- View department-wise pending reports
- Assign tasks to junior staff
- Accept / update task progress
- Upload work proof
- Real-time status updates

### 📊 Dashboards & Analytics
- Modern role-based dashboards
- Interactive charts & statistics
- Map view of complaints
- Quick overview of assigned / pending / completed tasks

### 📧 Notifications
- Email notifications via Nodemailer
- Status update alerts

### 🎨 User Experience
- Clean, modern & responsive UI (Tailwind CSS)
- Smooth animations & interactive components
- Toast notifications
- Mobile-friendly design

---

## 🛠️ Tech Stack

| Category          | Technologies                                      |
|-------------------|---------------------------------------------------|
| **Frontend**      | React.js, Tailwind CSS, Lucide React, React Router, Axios, React Toastify |
| **Backend**       | Node.js, Express.js                               |
| **Database**      | MongoDB Atlas, Mongoose                           |
| **Authentication**| JWT, bcrypt                                       |
| **Email**         | Nodemailer + Gmail SMTP                           |
| **Maps**          | Map integration for location tracking             |
| **Deployment**    | Vercel (Frontend), MongoDB Atlas                  |
| **Version Control**| Git & GitHub                                     |

---

## 🏗️ System Architecture

```text
┌──────────────────────────────┐
│       React Frontend         │
│   (Tailwind CSS + Role UI)   │
└──────────────┬───────────────┘
               │ REST API
               ▼
┌──────────────────────────────┐
│      Express.js Backend      │
│  JWT • RBAC • Controllers    │
└──────────────┬───────────────┘
               │
               ▼
        MongoDB Atlas
     (Users + Reports DBs)

📂 Project Structure
textNagar-Sahayata-Portal
│
├── client/                  # React Frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                  # Node.js Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── .env
│   └── package.json
│
├── README.md
└── .gitignore

🚀 Getting Started
📋 Prerequisites

Node.js (v18 or later)
npm
Git
MongoDB Atlas account
Gmail account (for App Password)


1️⃣ Clone the Repository
Bashgit clone https://github.com/abhay963/Nagar-Sahayata-Portal.git
cd Nagar-Sahayata-Portal

2️⃣ Backend Setup
Bashcd server
npm install
Create a .env file inside the server folder:
envMONGO_URI_AUTH=your_auth_db_connection_string
MONGO_URI_REPORTS=your_reports_db_connection_string
JWT_SECRET=your_super_secret_key
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
Start the backend:
Bashnpm run dev
Backend runs at: http://localhost:5000

3️⃣ Frontend Setup
Open a new terminal:
Bashcd client
npm install
Start the frontend:
Bashnpm start
Frontend runs at: http://localhost:3000

📸 Application Screenshots

  <img src="./client/src/assets/hero.png" width="900" alt="Hero Section">
  


  <img src="./client/src/assets/dashboard2.png" width="900" alt="Staff Dashboard">
  


  <img src="./client/src/assets/dashboard.png" width="1000" alt="Junior Staff Dashboard">


👥 Contributors

      
        <img src="https://avatars.githubusercontent.com/Aditi-Raj07" width="95">

        Aditi Raj
      
    
      
        <img src="https://avatars.githubusercontent.com/adityakumar5492" width="95">

        Aditya Kumar
      
    
      
        <img src="https://avatars.githubusercontent.com/Akshat-shukla18" width="95">

        Akshat Shukla
      
    
      
        <img src="https://avatars.githubusercontent.com/Aashi008" width="95">

        Aashi
      
    
      
        <img src="https://avatars.githubusercontent.com/amandubey923" width="95">

        Aman Dubey
      
    
      
        <img src="https://avatars.githubusercontent.com/abhay963" width="95">

        Abhay Kumar
      
    

  Built with collaboration, dedication & teamwork 🚀


📌 Future Improvements

Real-time notifications using Socket.io
Advanced filtering & search for complaints
Mobile Progressive Web App (PWA)
Admin analytics with export (PDF/Excel)
Multi-language support
Dark mode


👨‍💻 Author & Maintainers
Abhay Kumar and team
GitHub: https://github.com/abhay963

📄 License
This project is developed for educational and community service purposes.


  Made with ❤️ for smarter cities

  Happy Coding! 💡

```
