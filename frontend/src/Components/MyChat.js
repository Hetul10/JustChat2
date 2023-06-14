import React, { useEffect } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { useState } from 'react';
import { Button, useToast,Box, Stack,Text } from '@chakra-ui/react';
import axios from 'axios';
import ChatLoading from './chatLoading';
import { getSender } from '../config/chatLogic';
import GroupChatModel from './chatInterface/GroupChatModel';

const MyChat = ({fetchAgain}) => {
  const [loggedUser,setLoggedUser]=useState();
  const {selectedChat,setSelectedChat,user,chats,setChats}=ChatState();
  const toast=useToast();

  const fetchChats=async()=>{
    try{
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data}=await axios.get("/api/chat",config);
      setChats(data);
    }catch(err){
      toast({
        title:'Error',
        duration:5000,
        isClosable:true,
        position:'top-left'
      })
    }
  }
  
  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo"))); 
    fetchChats();
  },[fetchAgain]);

  return (
    <Box display={{base:selectedChat?"none":"flex",md:"flex"}} flexDir="column" alignItems="center" p={3}
    bg="white" w={{base:"100%",md:"30%"}} borderRadius="lg" borderWidth="1px">
      <Box pb={3} px={3} fontSize={{base:"28px",md:"30px"}} display='flex' w='100%'
      justifyContent='space-between' alignItems='center'>
        My Chat
        <GroupChatModel>
          <Button display='flex' fontSize={{base:"17px",md:'10px',lg:'17px'}}>
            Add New Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box display='flex' flexDir='column' p={3} bg='lightblue' w='100%' h='100%' borderRadius="lg" overflow='hidden'>
        {chats?(
          <Stack overflow='scroll'>
            {chats.map((chat)=>{
              return <Box onClick={()=>setSelectedChat(chat)} cursor='pointer' 
              bg={selectedChat===chat?'green':'lightgrey'} border='2px ' color={selectedChat===chat?'white':'black'} px={3} py={2}
              borderRadius='lg' key={chat._id}> 
                <Text>{!chat.isGroupChat?getSender(loggedUser,chat.users):chat.chatName}</Text>
              </Box>
            })}
          </Stack>
        ):(
          <ChatLoading/>
        )}
      </Box>
    </Box>
  )
}

export default MyChat;
