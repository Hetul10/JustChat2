import { Avatar, Box,Text } from '@chakra-ui/react'
import React from 'react'

const UserListItem = ({user,handleFunction}) => {
  return (
    <Box onClick={handleFunction} cursor='pointer' hover={{color:'blue'}} w='100%' display='flex' alignItems='center' color='black'
    px={3} py={2} pz={2} borderRadius='lg'>
        <Avatar mr={2} size='sm' cursor='pointer' name={user.name}/>
        <Box>
            <Text>{user.name}</Text>
            <Text fontSize='xs'>
                <b>Email : {user.email}</b>
            </Text>
        </Box>
    </Box>
  )
}

export default UserListItem
