import {Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton, Box} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useToast,Input } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import { FormControl } from '@chakra-ui/react';
import axios from 'axios';
import UserListItem from '../UserKaHooliya/UserListItem';
import UserBadgeItem from '../UserKaHooliya/UserBadgeItem';

const GroupChatModel = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupName,setGroupName]=useState();
    const [selectedUsers,setSelectedUsers]=useState([]);
    const [search,setSearch]=useState();
    const [searchResult,setSearchResult]=useState();
    const [loading,setLoading]=useState();

    const toast=useToast();
    const {user,chats,setChats}=ChatState();

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

    const handleSubmit= async ()=>{
      if(!groupName||!selectedUsers){
        toast({
          title:'Please fill all the fields',
          duration:5000,
          isClosable:true,
          position:'top'
        })
        return;
      }
      try{
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`,
          }
        }
        const body={
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id))
        }
        const {data}= await axios.post('/api/chat/group',body,config);
        setChats([data,...chats]);
        onClose();
        toast({
          title:'New Group Created',
          duration:'5000',
          isClosable:true,
          position:'top'
        })
      }catch(err){
        toast({
          title:'Unable to create group',
          duration:'5000',
          isClosable:true,
          position:'top'
        })
      }
    }

    const handleDelete=(userToDel)=>{
      setSelectedUsers(selectedUsers.filter((sel)=> sel._id!==userToDel._id))
    }

    const handleGroup=(userToAdd)=>{
      if(selectedUsers.includes(userToAdd)){
        toast({
          title:'Already a member',
          duration:5000,
          isClosable:true,
          position:'top'
        })
        return;
      }
      setSelectedUsers([...selectedUsers,userToAdd]);
    }

    return (
      <>
        <span onClick={onOpen}>{children}</span>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Form new group</ModalHeader>
            <ModalCloseButton />
                <ModalBody display='flex' flexDir='column' alignItems='center'>
                    <FormControl>
                        <Input placeholder='Group Name' mb={3} onChange={(e)=>setGroupName(e.target.value)}/>
                    </FormControl>
                    <FormControl>
                        <Input placeholder='Add group members' mb={1} onChange={(e)=>handleSearch(e.target.value)}/>
                    </FormControl>
                    <Box w="100%" d="flex" flexWrap="wrap">
                      {selectedUsers.map((u)=>{
                        return <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)}/>
                      })}
                    </Box>
                    {loading?(<div>Loading...</div>):(searchResult?.slice(0, 4).map((user) => (<UserListItem key={user._id} user={user}
                    handleFunction={() => handleGroup(user)}/>)))}
                </ModalBody>
            <ModalBody>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='green' onClick={handleSubmit}>
                Create Group
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>);
}

export default GroupChatModel
