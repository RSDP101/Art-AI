import React, { useState } from 'react';
import OpenAI from 'openai';
import './App.css'; // Import CSS file for styling

const openai = new OpenAI({
  apiKey: 'sk-proj-yCFxEwZo9PLIlwwfwPJBT3BlbkFJCu7lYhhXE4PTpGtUGNuX',
  dangerouslyAllowBrowser: true,
});

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleGenerateAnswer = async () => {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: question },
        ],
      });

      setAnswer(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      setAnswer('An error occurred while fetching the response.');
    }
  };

  const handleClearAnswer = () => {
    setQuestion('');
    setAnswer('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chatbot Interface</h1>
      </header>
      <div className="chat-container">
        <div className="question-box">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question..."
            className="input-box"
          />
        </div>
        <div className="answer-box">
          <textarea
            value={answer}
            readOnly
            placeholder="Answer will appear here..."
            className="input-box"
          />
        </div>
        <div className="button-container">
          <button onClick={handleGenerateAnswer} className="button">
            Generate Answer
          </button>
          <button onClick={handleClearAnswer} className="button">
            Clear Answer
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
