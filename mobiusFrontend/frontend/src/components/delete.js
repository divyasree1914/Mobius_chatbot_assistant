import axios from 'axios';

export const deleteThread = async (threadId) => {
      const apiKey = process.env.REACT_APP_API_KEY;
      const backend = process.env.REACT_APP_BACKEND;        
        try {
            const response = await axios.delete(`https://api.openai.com/v1/threads/${threadId}`,
            { headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v1',
              },
            })
            console.log("messages",response)
            }catch(error){
                console.log(error)
            } 
        try{
            const response = await axios.delete(`${backend}/thread?thread_id=${threadId}`)
            console.log("messages",response)
        }
        catch(error){
            console.log(error)
        }         
}