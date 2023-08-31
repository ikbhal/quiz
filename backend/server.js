const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 5001;


// Enable CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a /ping API route
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Define a route to handle quiz data
app.get('/api/quiz', (req, res) => {
  try {
    const dbPath = path.join(__dirname, 'db.json');
    const quizData = fs.readFileSync(dbPath, 'utf8');
    res.json(JSON.parse(quizData));
  } catch (error) {
    console.error('Error reading quiz data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
