
import axios from 'axios';
import OpenAI from 'openai';
export const run = async (threadId,assistant_id) => {
    
    const openai = new OpenAI({
        apiKey: process.env.REACT_APP_API_KEY,
        dangerouslyAllowBrowser: true
      });
    let run_id;
      const apiKey = process.env.REACT_APP_API_KEY; 
      try {
        const response = await axios.post(`https://api.openai.com/v1/threads/${threadId}/runs`,   //create run
        {
            "assistant_id": assistant_id
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1',
          },
        })
        run_id = response.data.id
        console.log(response.data.id)
        console.log("create run ",response.data)
        }catch(error){
            console.log(error)
        }
      
        try {
            let  response = await axios.get(`https://api.openai.com/v1/threads/${threadId}/runs/${run_id}`, // retrieve run
            {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v1',
              },
        })
        console.log("response.status",response.data.status)
        while (response.data.status === "in_progress" || response.data.status === "queued") {
          console.log("waiting...");
          await new Promise((resolve) => setTimeout(resolve, 5000));
          response = await axios.get(`https://api.openai.com/v1/threads/${threadId}/runs/${run_id}`, {
              headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                  'OpenAI-Beta': 'assistants=v1',
              },
          });
      }      
        console.log("run retrieval",response.data)
        }catch(error){
            console.log(error)
        }
        try {
            const response = await axios.get(`https://api.openai.com/v1/threads/${threadId}/messages`,
            {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v1',
              },
        })
        console.log("all messages in thread",response.data)
        const chats = response.data.data.map(chat => ({
          role: chat.role,
          message: chat.content[0].text.value,
        }));

        console.log(chats);
        return chats.reverse()
        }catch(error){
            console.log(error)
        }
            
}