import { Avatar, Box, Button, IconButton, Typography } from '@mui/material'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { userAuth } from '../context/AuthContext'
import { red } from '@mui/material/colors';
import ChatItem from '../components/chat/ChatItem';
import { IoMdSend } from 'react-icons/io'
import { deleteUserChats, getUserChats, sendChatRequest } from '../helpers/api-communicator';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type Message = {
  role: "user" | "assistant",
  content: string
}

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = userAuth();
  const [chat_messages, setChatMessages] = useState<Message[]>([])
  
  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if(inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage:Message = {role: "user", content}
    setChatMessages((prev)=> [...prev, newMessage])
    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats]);
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting chats ...", {id: "deletechats"});
      await deleteUserChats()
      toast.success("Deleted chats ...", {id: "deletechats"});
      window.location.reload();
    
    } catch (error) {
      console.log(error)
      toast.error("Error in Deleting chats ...", {id: "deletechats"});
    }
  }

  useLayoutEffect(() => {
    if(auth?.isLoggedIn && auth.user) {
      toast.loading("Loading chats...", {id: "loadchats"});
      getUserChats().then((data) => {
        setChatMessages([...data.chats]);
        toast.success("Succesfully Loaded chats...", {id: "loadchats"})
      }).catch(err => {
        console.log(err);
        toast.error("Loading chats failed", {id: "loadchats"})
      }) ;
    }
  }, [auth])
  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth?.user, navigate]);
  return <Box sx={{display: 'flex', flex: 1, width: '100%', height: '100%', mt: 3, gap: 3}}>
    <Box sx={{display: {md: 'flex', sm: 'none', xs: 'none'}, flex: 0.2, flexDirection: 'column'}}>
      <Box sx={{display: 'flex', width: '100%', height: '60vh', bgcolor: 'rgb(17,29,39)', borderRadius: 5, flexDirection: 'column', mx: 3}}>
        <Avatar sx={{mx: 'auto', my: '2', bgcolor: 'white', color: 'black', fontWeight: 700}}>{auth?.user?.name[0]}</Avatar>
        <Typography sx={{mx: 'auto', fontFamily: 'work sans' }}>You are talking to a chatbot</Typography>
        <Typography sx={{mx: 'auto', fontFamily: 'work sans', my: 4, p: 3}}>You can ask some questions related to Knowledge, Business, Advices, Education, etc. Please refrain from sharing personal information, </Typography>
        < Button onClick={handleDeleteChats} sx={{width: '200px', my: 'auto', color: 'white', fontWeight: 700, mx: 'auto', borderRadius: 3 ,bgcolor: red[300], ":hover": {bgcolor: red.A400}}}>Clear Conversation</Button>
      </Box>
    </Box>
    <Box sx={{display: 'flex', flex: {md: 0.8, xs: 1, sm: 1}, flexDirection: 'column', px: 3}}>
      <Typography sx={{mx: 'auto', textAlign: 'center', fontSize: '40px', color: 'white', mb: 2}}>Model - GPT 4</Typography>
      <Box sx={{width: '100%', height: '60vh', borderRadius: 3, mx: 'auto', display: 'flex', flexDirection: 'column', overflow: 'scroll', overflowX: 'hidden', overflowY: 'auto', scrollBehavior: 'smooth'}}>
        {chat_messages.map((chat, index) => (<ChatItem content={chat.content} role={chat.role} key={index} />))}
      </Box>
      <div style={{width: '100%', padding: '20px', borderRadius: 8, backgroundColor: 'rgb(17,27,39)', display: 'flex', margin: 'auto'}}>
      <input  ref={inputRef} type = "text" style={{width: '100%', backgroundColor: 'transparent', padding: '10px', border: 'none', outline: 'none', color: 'white', fontSize: '20px'}}></input>
      <IconButton onClick={handleSubmit} sx={{ml: 'auto', color:'white'}}><IoMdSend /></IconButton>
      </div>
    </Box>

  </Box>

  
}

export default Chat