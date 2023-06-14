import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box,FormControl,IconButton,Spinner,Text,Input } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider"
import MyProfile from "./chatInterface/MyProfile";
import { getSender,getSenderFull } from "../config/chatLogic";
import UpdateGroupChatModal from "./chatInterface/UpdateGroupChatModal";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client';

const ENDPOINT='http://localhost:5000';
var socket,selectedChatCompare;

const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const [messages,setMessages]=useState([]);
    const [loading,setLoading]=useState(false);
    const [newMessage,setNewMessage]=useState();
    const [socketConnected,setSocketConnected]=useState(false);
    const [typing,setTyping]=useState(false);
    const [isTyping,setisTyping]=useState(false);

    const {user,selectedChat,setSelectedChat,notification,setNotification}=ChatState();

    const toast=useToast();

    useEffect(()=>{
        socket=io(ENDPOINT);
        socket.emit('setup',user);
        socket.on('connected',()=> setSocketConnected(true))
        socket.on('typing',()=> setisTyping(true));
        socket.on('stop typing',()=> setisTyping(false));
    },[])

    useEffect(()=>{
        fetchMessages();
        selectedChatCompare=selectedChat;
    },[selectedChat]);

    useEffect(()=>{
        socket.on('message recieved',(newMessageRecieved)=>{
            if(!selectedChatCompare||selectedChatCompare._id!==newMessageRecieved.chat._id){
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved,...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else{
                setMessages([...messages,newMessageRecieved])
            }
        })
    })

    const fetchMessages=async()=>{
        if(!selectedChat) return;
    
        try{
            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true);

            const {data}=await axios.get(`/api/message/${selectedChat._id}`,config);
            console.log(data);
            setMessages(data);
            setLoading(false);

            socket.emit('join chat',selectedChat._id);
        }catch(err){
            toast({
                title:'Error in fetching message',
                duration:5000,
                isClosable:true,
                position:'bottom'
            })
            setLoading(false);
        }
    }

    const sendMessage= async (e)=>{
        socket.emit('stop typing',selectedChat._id);
        if(e.key==='Enter'&& newMessage){
            try{
                const config={
                    headers:{
                        'Content-Type':'application/json',
                        Authorization: `Bearer ${user.token}`
                    }
                }
                setNewMessage('');
                const body={
                    content:newMessage,
                    chatId:selectedChat._id
                }
                const {data}=await axios.post('/api/message',body,config);
                socket.emit('new message',data);
                setMessages([...messages,data]);
            }catch(err){
                toast({
                    title:'Error in sending message',
                    duration:5000,
                    isClosable:true,
                    postion:'bottom'
                })
            }
        }
    };

    const typingHandler=(e)=>{
        setNewMessage(e.target.value);

        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit('typing',selectedChat._id);
        }

        let lastTypingTime=new Date().getTime();
        var samaySeema=3000;
        setTimeout(()=>{
            var timeNow=new Date().getTime();
            var timeDiff=timeNow-lastTypingTime;
            if(timeDiff>=samaySeema&&typing){
                socket.emit('stop typing',selectedChat._id);
                setTyping(false);
            }
        },samaySeema);
    }

  return (
    <>
        {
            selectedChat?(
                <>
                <Text display='flex' fontSize={{base:'30px',md:'30px'}} pb={3} px={2} w='100%' j
                alignItems='center' ustifyContent={{base:'space-between'}}>
                    <IconButton display={{base:'flex',md:'none'}} icon={<ArrowBackIcon/>} onClick={()=>setSelectedChat("")}/>
                    {selectedChat.isGroupChat?(
                        <>
                        {selectedChat.chatName}
                        <Box ml='10px'><UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
                        fetchMessages={fetchMessages}/></Box>
                        </>
                    ):(
                        <>
                        {getSender(user,selectedChat.users)}
                        <Box ml='10px'><MyProfile user={getSenderFull(user,selectedChat.users)}/></Box>
                        </>
                    )}
                </Text>
                    <Box display='flex' flexDir='column' justifyContent='flex-end' p={3} 
                    bg='linear-gradient(lightblue,lightgreen)' w='100%' h='100%' borderRadius='lg'
                    overflowY='hidden'>
                        {loading?(<Spinner size='xl' w={20} h={20} alignSelf='center' margin='auto'/>):(
                            <div style={{display:'flex',flexDirection:'column',overflow:'scroll'}}>
                                <ScrollableChat messages={messages}/>
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping?<div>Typing...</div>:(<></>)}
                            <Input variant='filled' bg='white' placeholder='Type your message' onChange={typingHandler} value={newMessage}/>
                        </FormControl>
                    </Box>
                </>
            ):(
                <Box display='flex' alignItems='center' justifyContent='center' h='100%'>
                    <Text fontSize='3xl' pb={3}>
                        Start chatting with a user by just clicking it
                    </Text>
                </Box>
            )
        }
    </>
  )
}

export default SingleChat
