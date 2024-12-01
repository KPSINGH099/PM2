const express = require('express');
const app = express();
const port = 3000;

// This could be set via environment variables or a configuration file
const appEnv = process.env.APP_ENV || 'development'; // Default to 'development'

// Define the /send endpoint
app.get('/send', (req, res) => {
  res.json({ app_env: appEnv });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
