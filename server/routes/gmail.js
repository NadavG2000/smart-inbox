const { authorize, listUnreadEmails, markEmailAsRead } = require('./gmail_service');
const axios = require('axios');

async function processEmails() {
  const auth = await authorize();
  const emails = await listUnreadEmails(auth);
  const importantEmails = [];

  for (const email of emails) {
    const snippet = email.snippet || 'No content';

    try {
      // Ask your AI to classify
      const aiResponse = await axios.post('http://localhost:3000/summarize', { emailText: snippet });
      const { aiResponse: aiText } = aiResponse.data;

      const parsed = JSON.parse(aiText); // { category: ..., summary: ... }

      if (parsed.category === 'advertising') {
        // If ad, mark as read
        await markEmailAsRead(auth, email.id);
      } else {
        // If important, keep it for frontend
        importantEmails.push({
          id: email.id,
          category: parsed.category,
          summary: parsed.summary,
        });
      }
    } catch (error) {
      console.error('🛑 Error processing email:', error.message);
    }
  }

  return importantEmails;
}

module.exports = {
  processEmails
};
