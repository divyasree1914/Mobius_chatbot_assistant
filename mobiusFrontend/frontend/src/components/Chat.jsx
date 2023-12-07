import "./chat.css"
import mobius from "../images/mobius.png"
import { getAllAssistant } from "../utils/allAssistants";
import { getAllthreads } from "../utils/allAssistants";
import { createThread } from "../utils/allAssistants";
import { thread } from "./thread";
import { useState } from "react";
import { useEffect } from "react";
import { messages } from "./messages";
import { run } from "./run";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { deleteThread } from "./delete";

const Chatbot = () => {
    const [userId,setUserId] = useState("xyz")  //for storing userid
    const [assistants,setAssistants] = useState([]) // to get all assistants
    const [selectedAssistant, setSelectedAssistant] = useState(null); // to set assistant which is selected in dropdown
    const [threadids,setThreadIds] = useState([])   // to get all thread ids for a particular usr and assistant
    const [newThread,setNewThread] = useState(false)  // the state to update when click on new chat
    const [inputValue,setInputValue] = useState("")   // to capture input value
    const [displayMessage,setDisplayMessage] = useState([])
    const [oldthread,setOldThread]  = useState("")
    const [load,setLoad] = useState(true)
    const [deleteThreadId,setDeleteThread] = useState(false)
    let sendMessage = false
    let threadId
    useEffect(()=>{
      getAllAssistant(userId).then(async (response)=>{
        console.log(response)
            setAssistants([...response])
            console.log("assistant in app",assistants)
          }).catch((e)=>{
            console.log(e)
          })
          
    },[userId])
    useEffect(()=>{
      console.log("-----------*---------- useEffect")
      getAllthreads(userId,selectedAssistant)
      .then(async (response)=>{
        console.log(response)
            setThreadIds([...response])
          }).catch((e)=>{
            console.log(e)
          })
          setDisplayMessage([])
    },[selectedAssistant,deleteThreadId])
    console.log("threads in app Chat",threadids)  
    const handleAssistantChange = (event) => {
      const selectedAssistantId = event.target.value;
      setSelectedAssistant(selectedAssistantId);
      console.log('Selected Assistant ID:', selectedAssistantId);
    };
    const handleNewSession = () =>{
      if(!selectedAssistant){
        alert("Please select Assistant")
      }else{
        setNewThread(true)
      }
      setDisplayMessage([])
    }
    const handleSendMessage =async ()=>{
      // debugger
      sendMessage = true
      setLoad(false)
      if(!newThread){
        console.log('threadId in same thread',oldthread,inputValue)
        await messages(oldthread,inputValue).then((response)=>{ // passing input message to message api 
          console.log("in messages in same thread")
        })
        console.log('threadId in same thread',oldthread,inputValue)
        await run(oldthread,selectedAssistant).then((response)=>{
          console.log("sorted messages in chat js from thread messages",response)
          setDisplayMessage(response)
        })
      }
      else if(sendMessage && newThread){
        console.log(sendMessage,newThread)
        const words = inputValue.split(' ');
        // Take the first two to three words
        
        const capturedWords = words.slice(0, 3).join(' ');
        console.log('Captured words:', capturedWords);
        await thread().then((response)=>{    // calling thread function to create thread from openai 
          console.log("thread in chatjs",response)
          threadId = response
          setOldThread(response)
        })
        
        console.log("in chat.js the thread id",threadId)
        let details = {thread_id:threadId,title:capturedWords}
        await messages(threadId,inputValue).then((response)=>{ // passing input message to message api 
          console.log("in messages")
        })
        await run(threadId,selectedAssistant).then((response)=>{
          console.log("sorted messages in chat js from thread messages",response)
          setDisplayMessage(response)
        })
        createThread(userId, selectedAssistant, [details]) // Pass an array of details to the backend to store thread id and title
        .then(() => {
          // Call getAllthreads after creating a new thread
          return getAllthreads(userId, selectedAssistant);
        })
        .then((response) => {
          setThreadIds([...response]);
        })
        .catch((e) => {
          console.log(e);
        });
        setNewThread(false)
    }
      
      sendMessage = false
      setInputValue("")
      setLoad(true)
    }
    const handleToggleChat = async (id)=>{
      setOldThread(id)
      const apiKey = process.env.REACT_APP_API_KEY;
      console.log("thread id in toggle chat",id)
      try {
        const response = await axios.get(`https://api.openai.com/v1/threads/${id}/messages`,
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

    // console.log(chats);
    setDisplayMessage(chats.reverse())
    }catch(error){
        console.log(error)
    }

    }
    const handleDelete=async (thread_ID)=>{
      console.log(thread_ID)
      await deleteThread(thread_ID)
      setDeleteThread(true)
    }
    return (
        <div className="container">
          <div className="left-panel">
            <div className="left-top">
            <img src={mobius} alt="Mobius" />
            <button onClick={handleNewSession}>New Chat</button>
            </div>
            <div className="thread-list">
              {threadids.map((threadId, index) => (
                <div id="sessionBox" key={index} style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong onClick={() => { handleToggleChat(threadId.thread_id) }}  style={{ cursor: "pointer" }}>{threadId.thread_title}</strong>
                  <button style={{ backgroundColor: "orange" }} onClick={() => handleDelete(threadId.thread_id)}>Delete</button>
                </div>
              ))}
            </div>

          </div>
          <div className="right-panel">
            <div className="upper-right">
            <div>
            <label htmlFor="chatDropdown"></label>
            <select id="chatDropdown" onChange={(e)=>{handleAssistantChange(e)}}>
            <option value="" disabled selected>
                Select 
                </option>
              {assistants.map((assistant) => (
                <option key={assistant.assistant_id} value={assistant.assistant_id}>
                  {assistant.assistant_name}
                </option>
              ))}
            </select>
            </div>
            <div className="right-panel-upper">
            {displayMessage.map((data, index) => (
            
        <div key={index} className="chatBox">
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
            </div>
            </div>
            <div className="lower-right">
                <input type="text" id="query" onChange={(e)=>{setInputValue(e.target.value)}} value={inputValue}/>
                <button className="" onClick={handleSendMessage} >{load?`Send`:<ClipLoader
        color="white"
        size={24}
        aria-label="Loading Spinner"
        data-testid="loader"
      />}</button>
            </div>
          </div>
        </div>
      );
}
export default Chatbot