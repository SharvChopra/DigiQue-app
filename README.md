# DigiQue - Hospital Appointment Booking System

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

DigiQue is a full-stack, dual-portal web application designed to modernize and streamline the medical appointment process. It provides a user-friendly platform for patients to discover nearby hospitals and book appointments in real-time. It also features a comprehensive dashboard for hospital administrators to manage their doctors, schedules, appointments, and public-facing profiles.

---

## ✨ Key Features

This application is split into two main portals, each with its own set of features.

### Patient Portal

* **Secure Authentication:** Patients can register, log in, and manage their own accounts.
* **Geolocation-based Search:** On the homepage, the app automatically fetches the user's location to display a list of nearby hospitals, sorted by proximity.
* **Hospital Discovery:** Patients can browse all listed hospitals, view their detailed public profiles (including banner images, logos, 'About' sections, and lists of services).
* **Doctor Discovery:** On a hospital's detail page, patients can see a list of all doctors associated with that hospital, including their specialty and profile picture.
* **Real-Time Booking:**
    * Patients can click "Book Appointment" on a doctor.
    * A modal appears, allowing them to select a date.
    * The app makes a real-time API call to fetch available time slots for that specific doctor on that day.
    * This availability is dynamically generated based on the doctor's schedule (set by the admin) and any appointments that are already booked.
* **Appointment Management:** A dedicated "My Appointments" page with a calendar view. Patients can see all their upcoming and past appointments, click a date to see details, and have the option to reschedule or cancel.
* **Personal Settings:** Patients can update their personal profile (name, email, phone) and securely change their password.

### Hospital Admin Portal

* **Secure Role-Based Authentication:** A separate login for users with a "HOSPITAL" role.
* **Overview Dashboard:** An at-a-glance homepage showing key statistics, such as "Today's Appointments," "Upcoming Appointments," and "Total Doctors Listed."
* **Doctor Management (Full CRUD):**
    * **Add:** Add new doctors to the hospital's roster.
    * **Edit:** Update a doctor's name, specialty, and profile image URL.
    * **Delete:** Remove a doctor from the roster.
* **Dynamic Schedule Management:**
    * An "Edit Schedule" modal for each doctor.
    * Set availability (isAvailable, startTime, endTime) for all 7 days of the week.
    * Set a specific `appointmentDuration` (e.g., 15, 30, 45 minutes) which is used to generate the patient-facing time slots.
* **Appointment Management:**
    * View a complete list of all appointments booked for their hospital.
    * Filter appointments by date and/or by doctor.
    * **Update Status:** Mark appointments as "Completed" or "Cancelled."
* **Hospital Profile Management:**
    * Edit the hospital's entire public-facing profile.
    * Update basic info (name, address, contact).
    * Update the "About" description and the list of "Services Offered."
    * Update the **Banner Image URL** and **Logo URL** to control how the hospital appears on the patient's discovery page.
* **Admin Account Settings:**
    * Admins can update their *own* personal user account (first name, last name, email).
    * A separate, secure form to change their own login password.

---

## 📸 Screenshots

Here are a few snapshots of the application in action.

| Patient - Hospital Details | Patient - My Appointments | Admin - Manage Doctors |
| :---: | :---: | :---: |
|  |  |  |
| **Admin - Edit Schedule** | **Admin - Manage Appointments** | **Admin - Hospital Profile** |
|  |  |  |

---

## 🛠️ Technology Stack

### Frontend
* **React (v18+)**
* **React Router (v6)**: For client-side routing.
* **React Calendar**: For appointment management.
* **React Toastify**: For user-friendly notifications.
* **Vite**: For a fast development environment.

### Backend
* **Node.js**
* **Express.js**: For the REST API.
* **MongoDB**: NoSQL database for storing all application data.
* **Mongoose**: Object Data Modeling (ODM) for MongoDB.
* **JSON Web Tokens (JWT)**: For secure, stateless authentication.
* **bcrypt.js**: For hashing user passwords.

---

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

* [Node.js](https://nodejs.org/) (v18.x or later)
* `npm` (or `yarn`)
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance).

### Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/digique-app.git](https://github.com/your-username/digique-app.git)
    cd digique-app
    ```

2.  **Set Up the Backend**
    ```bash
    # Navigate to the backend folder
    cd backend

    # Install dependencies
    npm install

    # Create a .env file and add your variables
    touch .env

    # Run the server
    npm start
    ```

3.  **Set Up the Frontend**
    ```bash
    # From the root, navigate to the frontend folder
    cd ../frontend

    # Install dependencies
    npm install

    # Create a .env file and add your API URL
    touch .env

    # Run the development server
    npm run dev
    ```
    Your application should now be running at `http://localhost:5173` (or your Vite port).

---

## ⚙️ Environment Variables

You must create `.env` files in both the `frontend` and `backend` directories for the app to function.

#### `backend/.env`
```ini
# Your MongoDB connection string
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/yourDatabaseName

# A strong, secret string for signing JWTs
JWT_SECRET=your_super_secret_jwt_key
---

#### `frontend/.env`

# The URL where your backend server is running
VITE_BACKEND_API_URL=http://localhost:5000/api
