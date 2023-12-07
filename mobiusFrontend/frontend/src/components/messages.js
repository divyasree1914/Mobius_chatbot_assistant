import axios from 'axios';

export const messages = async (threadId,inputValue) => {
      const apiKey = process.env.REACT_APP_API_KEY;
      try {
        const response = await axios.post(`https://api.openai.com/v1/threads/${threadId}/messages`,
        {
            "role": "user",
            "content": inputValue,
        }, 
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1',
          },
        })
        console.log("messages",response)
        }catch(error){
            console.log(error)
        } 
}