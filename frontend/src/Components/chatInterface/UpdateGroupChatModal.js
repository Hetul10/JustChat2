import { ViewIcon } from "@chakra-ui/icons";
import { FormControl, useDisclosure } from "@chakra-ui/react";
import {Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton} from '@chakra-ui/react'
import { IconButton,Button,Box,Input } from "@chakra-ui/react";
import { useState} from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserKaHooliya/UserBadgeItem";
import axios from 'axios';
import { useToast } from "@chakra-ui/react";
import UserListItem from "../UserKaHooliya/UserListItem";


const UpdateGroupChatModal = ({fetchMessages,fetchAgain,setFetchAgain}) => {
    const {isOpen,onOpen,onClose}=useDisclosure();
    const [groupName,setGroupName]=useState();
    const [search,setSearch]=useState();
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const [renameLoading,setRenameLoading]=useState(false);

    const {selectedChat,setSelectedChat,user}=ChatState();
    const toast=useToast();

    const handleSearch= async (query)=>{
      setSearch(query);
      if(!query) return;
      
      try{
          setLoading(true);
          
          const config={
              headers:{
                  Authorization: `Bearer ${user.token}`
              }
          }
          const {data}=await axios.get(`/api/user?search=${search}`,config);
          const {body}=data;
          setLoading(false);
          setSearchResult(body.data);
      }catch(err){
          toast({
              title:'Error in forming group',
              duration:5000,
              isClosable:true,
              position:'top-left'
          })
      }
  }

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,{
          chatId: selectedChat._id,
          userId: user1._id,
        },config);

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error!",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupName("");
  };

    const handleAddUser = async (user1) => {
      if (selectedChat.users.find((u) => u._id === user1._id)) {
        toast({
          title: "User Already in group!",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
  
      if (selectedChat.groupAdmin._id !== user._id) {
        toast({
          title: "Only admins can add someone!",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
  
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const body={
          chatId: selectedChat._id,
          userId: user1._id,
        };
        const { data } = await axios.put(`/api/chat/groupadd`,body,config);
  
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error!",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
      setGroupName("");
    };

    const handleRename=async ()=>{
      if(!groupName) return;
      setRenameLoading(true);
      try{
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          }
        }
        const body={
          chatId:selectedChat._id,
          chatName:groupName
        }
        const {data}=await axios.put('/api/chat/rename',body,config);

        setSelectedChat(data);
        setRenameLoading(false);
        setFetchAgain(!fetchAgain);
      } catch(err){
        toast({
          title:'Enable to change group name',
          duration:5000,
          isClosable:true,
          position:'top'
        })
        setRenameLoading(false);
      }
      setGroupName("");
    }

        return (
          <>
            <IconButton display={{base:'flex'}} icon={<ViewIcon/>}onClick={onOpen}/>
      
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader fontSize='30px' display='flex' justifyContent='center'>{selectedChat.chatName}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box>
                        {selectedChat.users.map((u)=>(
                            <UserBadgeItem key={user._id} user={u} handleFunction={() => handleRemove(u)}/>
                        ))}
                    </Box>
                    <FormControl display='flex'>
                        <Input placeholder='Group Name' mb={3} value={groupName} onChange={(e) => setGroupName(e.target.value)}/>
                        <Button variant='solid' colorScheme='linkedin' ml={1} isLoading={renameLoading} onClick={handleRename}>
                            Update
                        </Button>
                    </FormControl>
                    <FormControl>
                        <Input placeholder='Add User to group' mb={1} onChange={(e)=> handleSearch(e.target.value)}/>
                    </FormControl>
                    {loading?(<div>Loading...</div>):(searchResult?.slice(0, 4).map((user) => (<UserListItem key={user._id} user={user}
                    handleFunction={() => handleAddUser(user)}/>)))}
                </ModalBody>
      
                <ModalFooter>
                  <Button colorScheme='red' onClick={() => handleRemove(user)}>
                    Leave Group
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        )
}

export default UpdateGroupChatModal
