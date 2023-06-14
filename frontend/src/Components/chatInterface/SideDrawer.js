import { Box, Tooltip,Button,Text, MenuButton,Menu ,Avatar,MenuList,MenuItem,MenuDivider, useToast,Spinner } from '@chakra-ui/react';
import { SearchIcon,BellIcon,ChevronDownIcon} from '@chakra-ui/icons'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import MyProfile from './MyProfile';
import { useDisclosure } from '@chakra-ui/react'; 
import { useHistory } from 'react-router-dom';
import { Drawer,DrawerBody,DrawerHeader,DrawerOverlay,DrawerContent,Input,Image} from '@chakra-ui/react'
import axios from 'axios';
import ChatLoading from '../chatLoading';
import UserListItem from '../UserKaHooliya/UserListItem';
import { getSender } from '../../config/chatLogic';

const SideDrawer = () => {
  const [search,setSearch]=useState("");
  const [searchResult,setSearchResult]=useState([]);
  const [loading,setLoading]=useState(false);
  const [loadingChat,setLoadingChat]=useState();

  const {user,setSelectedChat,chats,setChats,notification,setNotification}=ChatState();
  const {onClose,onOpen,isOpen}=useDisclosure();
  const history=useHistory();
  const toast=useToast();

  const logoutHandler=()=>{
    localStorage.removeItem('userInfo');
    history.push("/");
  }

  const handleSearch= async ()=>{
    if(!search){
      toast({
        title:"Please enter something",
        duration:5000,
        isClosable:true,
        position:'top-left'
      });
      return;
    }
    try{
      setLoading(true);
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }

      const {data}=await axios.get(`/api/user?search=${search}`,config);
      const {body}=data;
      setLoading(false);
      setSearchResult(body.data);
    }catch(err){
      toast({
        title:"Error is finding user",
        duration:5000,
        isClosable:true,
        position:'top-left'
      });
      setLoading(false);
    }
  }

  const accessChat=async (userId)=>{
    try{
      setLoadingChat(true);
      const config={
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data}=await axios.post("/api/chat",{userId},config);
      console.log(data);
      if(!chats.find((chatein)=>chatein._id===data._id)) setChats([data,...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    }catch(err){
      toast({
        title: "Error in fetching chats",
        duration:5000,
        isClosable:true,
        position:"top-left"
      })
    }
  }

  return (
    <>
    <Box display="flex" justifyContent="space-between" alignItems="center" bg="skyblue" w="100%" p="5px 10px 5px 10px" borderWidth="3px">
      <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
        <Button variant="ghost" onClick={onOpen}>
          <Text d={{base:"none",md:"flex"}} color="green" px="4">
            <SearchIcon/>
            {" "}Search User
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize={"2xl"} color='green'>Just-Talk</Text>
      <div>
        <Menu>
          <MenuButton p={1}>
            <BellIcon fontSize='2xl' m='1px'/>
          </MenuButton>
          <MenuList p={3}>
            {!notification.length&&'No new messages'}
            {notification.map((eveyones_distraction)=>( 
              <>
              <MenuItem key={eveyones_distraction._id} onClick={()=>{
                setSelectedChat(eveyones_distraction.chat);
                setNotification(notification.filter((n) => n!==eveyones_distraction))
              }}>
                {eveyones_distraction.chat.isGroupChat?(`Message in ${eveyones_distraction.chat.chatName}`):
                (`Message from ${getSender(user,eveyones_distraction.chat.users)}`)}
              </MenuItem>
              </>
            ))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
            <Avatar size='sm' curson='pointer' name={user.name}/>
          </MenuButton>
          <MenuList>
            <MenuItem>{"My Profile"}
              <MyProfile user={user}/>
            </MenuItem>
            <MenuDivider/>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>

    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerHeader>Search User</DrawerHeader>
        <DrawerBody>
          <Box display='flex' pb={2}>
            <Input placeholder="Search by name or email" mr={2} value={search} onChange={(e)=>setSearch(e.target.value)}/>
            <Button onClick={handleSearch}>Go</Button>
          </Box>
          {loading? <ChatLoading/>:(
            searchResult?.map((user)=>{
              return <UserListItem key={user._id} user={user} handleFunction={()=>{
                accessChat(user._id);
              }}/>
            })
          )}
          {loadingChat&&<Spinner ml="auto" display="flex"/>}
        </DrawerBody>
      </DrawerContent>
    </Drawer>

    </>
  )  
}

export default SideDrawer;