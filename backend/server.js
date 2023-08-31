const express = require('express');
const path = require('path');

const app = express();
const PORT = 5001;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a /ping API route
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
