# Blood_Bank_System

````markdown
# Campus Blood Donor Finder (Blood Bank System)

A web-based emergency response application designed for university campuses. This system allows users to quickly find blood donors based on blood groups and automates emergency SMS notifications to parents and classmates using the Twilio API.

## 🚀 Features

* **Emergency Notification System:** Select a student to instantly trigger an SMS alert to their parents and all registered classmates.
* **Donor Search:** Filter students by specific blood groups (e.g., A+, O-) to find eligible donors.
* **Direct Communication:** One-click SMS requests to specific matched donors.
* **CSV Data Integration:** Uses `papaparse` to dynamically load student and parent records from CSV files without requiring a complex SQL database setup.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Bootstrap 5), JavaScript (Vanilla).
* **Backend:** Node.js, Express.js.
* **Data Processing:** PapaParse (CSV parsing).
* **Communication API:** Twilio (for sending SMS).

## 📂 Project Structure

```text
Blood_Bank_System/
├── node_modules/       # Dependencies
├── public/             # Static Frontend Files
│   ├── index.html      # Main user interface
│   ├── new_style.css   # Custom styling
│   ├── script.js       # Frontend logic (Fetch API calls)
│   ├── student_blood_donation_dummy.csv # Student database
│   └── parents.csv     # Parent database
├── server.js           # Express server & Twilio integration
├── package.json        # Project metadata and scripts
└── README.md           # Documentation
````

## ⚙️ Installation & Setup

### 1\. Prerequisites

  * Node.js installed on your machine.
  * A generic text editor (VS Code recommended).
  * A valid [Twilio Account](https://www.twilio.com/) (SID, Auth Token, and Active Phone Number).

### 2\. Install Dependencies

Navigate to the project folder in your terminal and run:

```bash
npm install
```

### 3\. Configuration

Open `server.js` and locate the Twilio configuration section. Update the credentials with your own:

```javascript
// server.js lines 15-18
const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const TWILIO_NUMBER = '+1XXXXXXXXXX'; // Your active Twilio number
```

*Note: For production environments, it is recommended to use `.env` files to store secrets rather than hardcoding them.*

### 4\. Prepare Data

Ensure your CSV files are located in the `public/` directory:

1.  `student_blood_donation_dummy.csv`: Must contain headers like `Student Name`, `Student Mobile`, `Blood Group`, `Parent Name`.
2.  `parents.csv`: Must contain headers like `Parent Name`, `Parent Mobile`.

### 5\. Run the Server

Start the backend server:

```bash
npm start
```

The server will start running on: `http://localhost:5000`

## 📡 API Endpoints

| Method | Endpoint     | Description                                      |
| :----- | :----------- | :----------------------------------------------- |
| `GET`  | `/`          | Health check to verify server is running.        |
| `GET`  | `/get-data`  | Returns parsed JSON data from the CSV files.     |
| `POST` | `/send-sms`  | Sends an SMS via Twilio. Expects `{to, body}`.   |

## 📝 Usage Guide

1.  **Emergency Mode:**

      * Select a student name from the dropdown in the "Emergency Blood Request" card.
      * Click "Notify Parents & Classmates".
      * The system looks up the parent's number from the CSV and iterates through the student list to send bulk alerts.

2.  **Search Mode:**

      * Select a specific blood group (e.g., B+).
      * Click "Search Donors".
      * A list of matching students and their mobile numbers will appear.
      * Click "Send SMS" next to a specific donor to request help individually.

## 🛡️ License

This project is licensed under the ISC License.

```

***

### Why this is a "Good" Technical Summary:
1.  **Dependencies Identified:** It lists the specific libraries found in your `package.json` (PapaParse, Twilio, Express).
2.  **Setup Instructions:** It explains exactly which variables in `server.js` need to be changed for the app to actually work (the Twilio credentials).
3.  **Data Requirements:** It specifies the CSV headers required, which is crucial because `script.js` relies on specific keys like `"Student Name"` and `"Blood Group"`.
4.  **API Documentation:** It documents the routes defined in `server.js`, which helps developers understand how the frontend talks to the backend.
```
