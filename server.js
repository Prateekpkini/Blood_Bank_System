const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
const fs = require('fs');
const Papa = require('papaparse');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve index.html, script.js, etc.

const port = 5000;

// 🩸 Twilio setup
const accountSid = 'ACc2f1e95e54bf2e405543e10e7aa54e66';
const authToken = 'f5e18bb57a41f3ed0ff44b830591f283';
const client = twilio(accountSid, authToken);
const TWILIO_NUMBER = '+18144822088';

// 🧾 Function to load CSV files
function loadCSV(filepath) {
  const file = fs.readFileSync(filepath, 'utf8');
  return Papa.parse(file, { header: true, skipEmptyLines: true }).data;
}

// 🧠 Load both CSVs
let students = loadCSV('./public/student_blood_donation_dummy.csv');
let parents = loadCSV('./public/parents.csv');

// ✅ Route to provide data to frontend
app.get('/get-data', (req, res) => {
  res.json({ students, parents });
});

// 🏠 Basic test route
app.get('/', (req, res) => {
  res.send('✅ Twilio server running successfully!');
});

// 📨 SMS sending route
app.post('/send-sms', async (req, res) => {
  const { to, body } = req.body;
  console.log('📨 Incoming SMS request:', req.body);

  try {
    const message = await client.messages.create({
      from: TWILIO_NUMBER,
      to: `+91${to}`,
      body,
    });
    console.log('✅ Twilio Message SID:', message.sid);
    res.json({ status: 'Success', sid: message.sid });
  } catch (error) {
    console.error('❌ SMS Error:', error);
    res.status(500).json({ status: 'Failed', error: error.message });
  }
});

// 🖥️ Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
