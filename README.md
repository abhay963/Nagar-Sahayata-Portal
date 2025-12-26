<h1 align="center">🚀 Nagar-Sahayata-Portal (MERN)</h1>

<p align="center">
A smart platform where citizens can report local issues, and authorities can track, manage, and resolve complaints efficiently.
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/akshay-mern/assets/main/mern-animated.gif" width="650" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-green" />
  <img src="https://img.shields.io/badge/Role--Based%20Access-Enabled-blue" />
  <img src="https://img.shields.io/badge/Project-Nagar--Sahayata--Portal-orange" />
  <img src="https://img.shields.io/badge/Status-Active-success" />
</p>

---

## 🏙️ Overview

**Nagar-Sahayata-Portal** helps citizens raise complaints about social and civic issues in their locality.  
Authorities handle them using **role-based dashboards**:

- 👤 **User** — submit complaints  
- 🛠️ **Staff / Junior Staff** — manage assigned area complaints  
- 🧑‍💼 **Admin** — complete monitoring, assignment & control  

Built using the **MERN Stack**.

---

## ✨ Features

- 📢 File complaints with images & description  
- 🧭 Role-based dashboards (User / Staff / Junior Staff / Admin)  
- 📍 Area-wise complaint tracking  
- 🔐 Secure login with JWT  
- 📧 Email alerts for updates  
- 📊 Complaint lifecycle (Pending → In-Progress → Resolved)

---

## 🛠️ Tech Stack

| Layer | Tech |
|------|------|
| Frontend | React |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | JWT |
| Email | Nodemailer |

---

## 📸 Screens (replace with your screenshots)

<p align="center">
  <img src="https://placehold.co/1000x450?text=User+Dashboard" />
  <br/><br/>
  <img src="https://placehold.co/1000x450?text=Admin+Panel" />
</p>

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

bash
git clone https://github.com/abhay963/Nagar-Sahayata-Portal.git
cd Nagar-Sahayata-Portal
2️⃣ Install dependencies
bash
Copy code
# Frontend
cd client
npm install

Backend
cd ../server
npm install
🔐 Environment Variables
Create a .env file inside the server folder:

env
Copy code
# Mongo Databases
MONGO_URI_AUTH=your_auth_db_connection_string
MONGO_URI_REPORTS=your_reports_db_connection_string

# JWT
JWT_SECRET=your_super_secret_key

# Server
PORT=5000

# Email 
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here



▶️ Run the project
Backend
bash
Copy code
cd server
npm run dev
Frontend
bash
Copy code
cd client
npm start


🤝 Contributing
Pull requests and suggestions are welcome!

⭐ Support
If you like this project, please ⭐ the repo — it motivates future development!



Happy coding! 💡

yaml
Copy code

---


👥 Contributors

<p>
  <a href="https://github.com/YOUR_GITHUB">
    <img src="https://avatars.githubusercontent.com/YOUR_GITHUB" width="80" style="border-radius:50%" />
    <br/>
    <sub><b>Abhay</b></sub>
  </a>
</p>


<p align="center">
  <img src="./client/src/assets/dashboard.png" width="1000" />
</p>
<p align="center">
  <img src="./client/src/assets/signup.png" width="900" />
</p>

If you want, I can also:

📌 add screenshots & animations for you  
📌 customize sections (modules, API docs, install script)  
📌 check your repo for exposed secrets

Just share the repo link when you push!






