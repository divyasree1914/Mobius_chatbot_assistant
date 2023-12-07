import { useState } from "react";
import axios from "axios";

const backend = process.env.REACT_APP_BACKEND;

export const getAllAssistant = async (userId) => {
  let assistants = [];

  try {
    const userAssistantResponse = await axios.get(`${backend}/getuserAssistant?user_id=${userId}`);
    if (userAssistantResponse.data.assistant_objects.length > 0) {
      assistants = [...assistants, ...userAssistantResponse.data.assistant_objects];
    }

    const allAssistantResponse = await axios.get(`${backend}/getAssistant`);
    assistants = [...assistants, ...allAssistantResponse.data.gaian_assistant];
    return assistants;
  } catch (error) {
    console.error("Error fetching assistants:", error);
  }
  console.log("All assistants:", assistants);
};


export const getAllthreads = async (userId,assistantId) =>{
  console.log(userId,assistantId)
  try{
    let threads
    console.log("in app in threads-----------")
    const threadIds = await axios.get(`${backend}/getAllThreads?user_id=${userId}&assistantId=${assistantId}`);
    console.log(threadIds.data.messages)
    threads = threadIds.data.messages
    console.log("threads", threads)
    return threads
  }catch(error){
    console.error("Error fetching Threads:", error);
  }
}
export const createThread = async (userId,assistantId,threadDetails)=>{
  console.log("in creating threads",userId,assistantId,threadDetails)
  if(threadDetails.length>0){
  const response = await axios.post(`${backend}/createthreads`,
  {
    user_id:userId,
    assistant_id:assistantId,
    title: threadDetails[0]['title'],
    thread_id: threadDetails[0]['thread_id']
  }
  )
  console.log(response)
}
}