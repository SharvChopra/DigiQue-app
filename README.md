DigiQue - Hospital Appointment Booking System

DigiQue is a modern, full-stack web application designed to streamline the process of finding and booking medical appointments. It provides a user-friendly platform for patients to discover nearby hospitals, view doctor profiles, and schedule appointments in real-time.

✨ Core Features

Patient Authentication: Secure user registration and login using JWT.

Geolocation-based Search: Automatically detects user location to display nearby hospitals.

Provider Discovery: Browse a list of hospitals with detailed profiles, including services and doctor rosters.

Real-Time Availability: Check doctor availability and select from open time slots.

Appointment Booking: A seamless, multi-step process to book and confirm appointments.

Appointment Management: A personal calendar view for patients to track their upcoming and past appointments.

Feedback System: Allows users to submit feedback directly to administrators.

🛠️ Technology Stack

Frontend: React, React Router, React Calendar

Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Authentication: Custom JWT-based system with bcrypt for password hashing

🚀 Getting Started

Prerequisites

Node.js (v18.x or later)

npm

MongoDB Atlas account (or a local MongoDB instance)

Installation & Setup

Clone the repository:

git clone [https://github.com/your-username/digique-app.git](https://github.com/your-username/digique-app.git)
cd digique-app

Setup Backend:

cd backend
npm install

# Create a .env file and add your MONGODB_URI and JWT_SECRET

npm start

Setup Frontend:

cd ../frontend
npm install

# Create a .env.local file and add your VITE_BACKEND_API_URL

npm run dev

Your application should now be running locally!

Contributing

Contributions are welcome! Please feel free to submit a pull request.
