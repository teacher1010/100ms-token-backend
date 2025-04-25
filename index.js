const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT; // No fallback

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ 100ms Token Backend is running!');
});

app.post('/get-token', (req, res) => {
  const { user_id, room_id, role } = req.body;

  if (!user_id || !room_id || !role) {
    return res.status(400).json({ error: 'Missing user_id, room_id, or role' });
  }

  const payload = {
    access_key: process.env.HMS_ACCESS_KEY,
    room_id,
    user_id,
    role,
    type: 'app',
    version: 2,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };

  try {
    const token = jwt.sign(payload, process.env.HMS_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Token generation failed' });
  }
});

// ✅ Bind to 0.0.0.0 for Render
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server is running at http://0.0.0.0:${port}`);
});
