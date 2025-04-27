const { authorize, listUnreadEmails } = require('./routes/gmail_service');

async function main() {
    const auth = await authorize();
    const emails = await listUnreadEmails(auth);
    console.log('Fetched Emails:', emails.length);

    emails.forEach((email, index) => {
    const snippet = email.snippet;
    console.log(`Email ${index + 1}:`, snippet);
  });
}

main();
