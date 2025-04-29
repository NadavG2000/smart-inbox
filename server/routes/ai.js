const express = require('express');
const axios = require('axios');
const router = express.Router();

// Summarization endpoint
router.post('/summarize', async (req, res) => {
  const { emailText } = req.body;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistral/mistral-7b-instruct', // or another if you want
        messages: [
          {
            role: 'system',
            content: `
              You are a smart email assistant.
              For each email, classify it as one of: "work", "personal", "advertising", or "other".
              Then provide a short one-sentence summary.
              Return exactly in this JSON format: {"category": "CATEGORY", "summary": "SUMMARY"}.
            `
          },
          {
            role: 'user',
            content: `Here is the email:\n\n${emailText}`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'smart-inbox'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;

    res.json({ aiResponse }); // return full ai response
  } catch (error) {
    console.error('🛑 AI Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get classification from AI.' });
  }
});

module.exports = router;
