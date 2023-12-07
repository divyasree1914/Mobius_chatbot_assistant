
import axios from 'axios';

export const thread = async () => {

      const apiKey = process.env.REACT_APP_API_KEY;
      let thread_id 
      try {
        const response = await axios.post("https://api.openai.com/v1/threads",{}, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1',
          },
        })
        thread_id = response.data.id
        
        }catch(error){
            console.log(error)
        }
        console.log("thread id from thread functionality",thread_id)
        return thread_id 
}