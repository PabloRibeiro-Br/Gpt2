// server.js

const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public')); // Assuming your HTML/JS files are in a 'public' folder

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/public' });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    // Placeholder for generateResponse function, replace with actual implementation
    const response = await generateResponse(prompt);

    if (response.toLowerCase().includes('só respondo sobre transmissões automáticas')) {
      res.send("Desculpe, só respondo sobre transmissões automáticas.");
    } else {
      res.send({
        bot: response.trim()
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Placeholder for generateResponse function, replace with actual implementation
const generateResponse = async (prompt) => {
  // Example: Fetch from an external API
  const apiResponse = await fetch('https://gpt2-q4kz.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
    }),
  });

  if (apiResponse.ok) {
    const responseData = await apiResponse.json();
    return responseData.bot.trim();
  } else {
    const err = await apiResponse.text();
    throw new Error(err);
  }
};

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
