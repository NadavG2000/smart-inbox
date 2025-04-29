import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners'; // Spinner package

function App() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchImportantEmails = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/useful-emails');
      setEmails(response.data.emails || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>📩 Smart Inbox</h1>
      <button
        onClick={fetchImportantEmails}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Fetch Important Emails
      </button>

      {loading ? (
        <div style={{ marginTop: '20px' }}>
          <ClipLoader color="#4CAF50" loading={true} size={50} />
          <p>Loading important emails...</p>
        </div>
      ) : (
        <ul style={{ padding: 0 }}>
          {emails.map((email, index) => (
            <li key={email.id} style={{ 
              marginTop: '20px', 
              listStyle: 'none', 
              backgroundColor: '#f9f9f9', 
              padding: '15px', 
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              <h3>✉️ Email {index + 1}</h3>
              <p><strong>Snippet:</strong> {email.snippet}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
