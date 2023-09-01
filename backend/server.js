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

// support json
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
//set views  express
// app.
app.set('views', path.join(__dirname, 'views')); // Set the views folder
app.set('view engine', 'ejs');

// old: Define a route to handle quiz data
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

// let
app.get('/api/quiz/v3', (req, res) => {
  try {
    const dbPath = path.join(__dirname, 'dbv3.json');
    const quizData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    // Shuffle the quizData array to get random questions
    const shuffledQuizData = shuffleArray(quizData);

    // Select the first 10 questions from the shuffled array
    const selectedQuestions = shuffledQuizData.slice(0, 10);

    res.json(selectedQuestions);
  } catch (error) {
    console.error('Error reading quiz data:', error);
  }
});


// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
