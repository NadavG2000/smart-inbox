const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');
require('dotenv').config();


const SCOPES = ['https://www.googleapis.com/auth/gmail.modify']; // modify lets you read and mark as read
const TOKEN_PATH = 'token.json';

const credentials = {
  installed: {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: ['http://localhost:3000/oauth2callback']
  }
};

const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

async function authorize() {
  try {
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (error) {
    return getNewToken(oAuth2Client);
  }
}

async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  try {
    const code = await question('Enter the code from that page here: ');
    rl.close();
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log('✅ Token stored successfully to', TOKEN_PATH);
    return oAuth2Client;
  } catch (error) {
    console.error('Error while trying to retrieve access token', error);
  }
}


async function listUnreadEmails(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.list({
    userId: 'me',
    labelIds: ['INBOX'],
    q: 'is:unread',
    maxResults: 5,
  });

  const messages = res.data.messages || [];
  const fullMessages = [];

  for (const msg of messages) {
    const msgRes = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id,
    });
    fullMessages.push(msgRes.data);
  }

  return fullMessages;
}

module.exports = {
  authorize,
  listUnreadEmails
};
