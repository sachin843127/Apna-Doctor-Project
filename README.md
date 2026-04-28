# Apna Doctor

## Project Overview
Apna Doctor is a health assistant web application that helps users:
- login/register and access a personalized dashboard
- check symptoms with AI-based guidance
- use a doctor-style chat system
- save and view medical records
- find nearby hospitals via locator integration
- use a simple and user-friendly interface

## Features
- User authentication and personalization
- AI symptom guidance
- Record management with latest 5 records retention
- Doctor-style chat
- Hospital locator
- Clean dashboard and mobile-friendly interface
- 
## Prerequisites
- Node.js installed
- npm installed
- MongoDB running locally or MongoDB Atlas account

## Backend Setup
1. Open terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   Start the backend
   node server.js
Notes on MongoDB
Currently backend connects to:

mongodb://127.0.0.1:27017/apna_doctor
So make sure MongoDB is running locally before starting the server.

If you deploy to a service, change this to:

and set MONGO_URI in environment variables.

How to Run Locally
Clone the repo
Go to backend folder
Install packages
Start the server
Open frontend files in browser:
index.html
or auth.html
How to Run Locally
Clone the repo
git clone https://github.com/yourusername/Apna-Doctor.git
Go to backend folder
cd "Apna Doctor/backend"
Install packages
npm install
Start the server
node server.js
Open frontend files in browser:
index.html
or auth.html

