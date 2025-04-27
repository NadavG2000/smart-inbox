const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/summarize', async (req, res) => {
  const { emailText } = req.body;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model:'mistralai/mistral-7b-instruct', 
        messages: [
          { role: 'system', content: 'You are an assistant that summarizes email messages.' },
          { role: 'user', content: `Please summarize this email:\n\n${emailText}` }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000', // required by OpenRouter
          'X-Title': 'smart-inbox'
        }
      }
    );

    const summary = response.data.choices[0].message.content;
    res.json({ summary });
  } catch (error) {
    console.error('🛑 AI Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get summary from AI.' });
  }
});

module.exports = router;
