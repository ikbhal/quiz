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

// Route for the home page
app.get('/home', (req, res) => {
  res.render('home');
});

// Endpoint to list all quiz creators
app.get('/quiz-creator-list', (req, res) => {
  const creatorPath = path.join(__dirname, 'data', 'quizzes');

  try {
    const creators = fs.readdirSync(creatorPath).filter(file => fs.statSync(path.join(creatorPath, file)).isDirectory());
    res.render('quiz-creator-list', { creators });
  } catch (error) {
    console.error('Error listing quiz creators:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to list quizzes for a specific creator
app.get('/quiz-creator-list/:creator', (req, res) => {
  const creator = req.params.creator;
  const creatorPath = path.join(__dirname, 'data', 'quizzes', creator);

  try {
    const quizNames = fs.readdirSync(creatorPath).filter(file => fs.statSync(path.join(creatorPath, file)).isDirectory());
    res.render('quiz-list', { quizNames, creator });
  } catch (error) {
    console.error('Error listing quizzes for creator:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to list all quiz names for a creator
app.get('/quizcreator/:creator/quizzes', (req, res) => {
  const creator = req.params.creator;
  const creatorPath = path.join(__dirname, 'data', 'quizzes', creator);

  try {
    const quizNames = fs.readdirSync(creatorPath).filter(file => fs.statSync(path.join(creatorPath, file)).isDirectory());
    res.render('quiz-list', { quizNames, creator });
  } catch (error) {
    console.error('Error listing quiz names:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to create a new quiz
app.get('/create-quiz', (req, res) => {
  res.render('quiz-create');
});

// Endpoint to handle quiz submission
app.post('/create-quiz', (req, res) => {
  const { quizName, creatorName, questions } = req.body;
  const quizData = {
    quizName,
    creatorName,
    questions
  };
  const quizPath = path.join(__dirname, 'data', 'quizzes', creatorName, quizName);

  if (!fs.existsSync(quizPath)) {
    fs.mkdirSync(quizPath, { recursive: true });
    fs.writeFileSync(path.join(quizPath, `${quizName}.json`), JSON.stringify(quizData, null, 2));
    res.redirect('/');
  } else {
    res.send('Quiz already exists.');
  }
});

// Endpoint to load a quiz
app.get('/quizcreator/:creatorName/quiz/:quizName', (req, res) => {
  const creatorName = req.params.creatorName;
  const quizName = req.params.quizName;
  const quizPath = path.join(__dirname, 'data', 'quizzes', creatorName, quizName, `${quizName}.json`);
  if (fs.existsSync(quizPath)) {
    const quizData = JSON.parse(fs.readFileSync(quizPath, 'utf8'));
    res.json(quizData);
  } else {
    res.status(404).send('Quiz not found.');
  }
});

// old: guess, not sure; Endpoint to save participant's result
app.post('/take-quiz-save-result', (req, res) => {
  const { quizName, creatorName, participantName, answers } = req.body;
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const participantPath = path.join(__dirname, 'data', 'quizzes', creatorName, quizName, 'participants', `${participantName}-${timestamp}.json`);

  fs.writeFileSync(participantPath, JSON.stringify(answers, null, 2));
  res.send('Result saved successfully.');
});


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

// Endpoint to take the quiz  
app.get('/quizcreator/:creator/quiz/:quizName/take/test', (req, res) => {
  const creator = req.params.creator;
  const quizName = req.params.quizName;
  const quizPath = path.join(__dirname, 'data', 'quizzes', creator, quizName, `${quizName}.json`);

  try {
    const quizData = JSON.parse(fs.readFileSync(quizPath, 'utf8'));
    res.render('quiz-take-test', { quizName, questions: quizData.questions, creator });
  } catch (error) {
    console.error('Error reading quiz data:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Endpoint to handle quiz submission
// Endpoint to handle quiz submission
app.post('/quizcreator/:creator/quiz/:quizName/take/test', (req, res) => {
  const creator = req.params.creator;
  const quizName = req.params.quizName;
  const participant = req.body.participant; // Participant's name
  const answers = req.body.answers; // An array of selected options

  try {
    const quizPath = path.join(__dirname, 'data', 'quizzes', creator, quizName, `${quizName}.json`);
    const quizData = JSON.parse(fs.readFileSync(quizPath, 'utf8'));

    // Calculate the score and correct answers
    let score = 0;
    const correctAnswers = [];

    for (let i = 0; i < answers.length; i++) {
      if (parseInt(answers[i]) === quizData.questions[i].correctOption) {
        score++;
        correctAnswers.push(i);
      }
    }

    // Save participant's result in a JSON file
    const result = {
      participant,
      score,
      correctAnswers,
      totalQuestions: quizData.questions.length,
    };

    const datetime = Date.now();
    
    const resultPath = path.join(__dirname, 'data', 'quizzes', creator, quizName,
     'results', participant, `${datetime}.json`);

     // make sure directory path correct
     const resultDirPath = path.join(__dirname, 'data', 'quizzes', creator, quizName,
     'results', participant);

    fs.mkdirSync(resultDirPath, { recursive: true });
    fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));

    // Redirect to result page
    res.redirect(`/quizcreator/${creator}/quiz/${quizName}/results/${participant}/${datetime}`);
  } catch (error) {
    console.error('Error processing quiz submission:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to display participant result
// res.redirect(`/quizcreator/${creator}/quiz/${quizName}/results/${participant}/${dateime}`);
app.get('/quizcreator/:creator/quiz/:quizName/results/:participant/:dateime', (req, res) => {
  const creator = req.params.creator;
  const quizName = req.params.quizName;
  const participant = req.params.participant;
  const datetime = req.params.dateime;

  try {
    const resultPath = path.join(__dirname, 'data', 
      'quizzes', creator, quizName,
      'results', participant, 
      `${datetime}.json`);
    const resultData = JSON.parse(fs.readFileSync(resultPath, 'utf8'));

    const quizPath = path.join(__dirname, 'data', 'quizzes', creator, quizName, 'quiz.json');
    const quizData = JSON.parse(fs.readFileSync(quizPath, 'utf8'));

    res.render('participant-result', {
      participant,
      quizName,
      score: resultData.score,
      totalQuestions: resultData.totalQuestions,
      correctAnswers: resultData.correctAnswers,
      questions: quizData.questions,
    });
  } catch (error) {
    console.error('Error reading result data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to display participant's test history
app.get('/quizcreator/:creator/quiz/:quizName/results/history/:participant', (req, res) => {
  const creator = req.params.creator;
  const quizName = req.params.quizName;
  const participant = req.params.participant;

  try {
    const participantResultsPath = path.join(__dirname, 'data', 'quizzes', creator, quizName, 'results', participant);
    const testFiles = fs.readdirSync(participantResultsPath);

    const tests = testFiles.map(testFile => {
      const filePath = path.join(participantResultsPath, testFile);
      const test = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return {
        creator: creator,
        quizName: test.quizName,
        timestamp: parseInt(testFile.split('-')[1].split('.')[0]),
      };
    });

    res.render('participant-tests', { participant, tests });
  } catch (error) {
    console.error('Error reading participant test history:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
