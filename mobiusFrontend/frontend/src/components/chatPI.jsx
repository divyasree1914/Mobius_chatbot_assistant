import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Assistant = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = process.env.REACT_APP_API_KEY;

      try {
        const response = await axios.get("https://api.openai.com/v1/threads/thread_EnDSOJZk5HgvxkQaFyPsuZPp/messages", {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1',
          },
        });

        const chats = response.data.data.map(chat => ({
          role: chat.role,
          message: chat.content[0].text.value,
        }));

        console.log(chats);

        // Separate user and assistant messages
        const userMessages = [];
        const assistantMessages = [];

        chats.forEach(message => {
          if (message.role === 'user') {
            userMessages.push(message);
          } else {
            assistantMessages.push(message);
          }
        });

        // Concatenate user and assistant messages
        const sortedMessages = userMessages.concat(assistantMessages);

        setMessages(sortedMessages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <>
      {messages.map((data, index) => (
        <div key={index}>
          {data.role === 'user' ? (
            <>
              <div>User: {data.message}</div>
            </>
          ) : (
            <>
              <div>Assistant: {data.message}</div>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default Assistant;
