require('dotenv').config();
const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/ai');

const app = express();
app.use(cors());
const gmailRoutes = require('./routes/gmail'); 


// Routes
app.use('/', aiRoutes);
app.use('/', gmailRoutes);

app.get('/', (req, res) => {
  res.send('✅ Smart Inbox backend is running!');
});

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
