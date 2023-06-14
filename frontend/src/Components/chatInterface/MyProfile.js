import React from 'react'
import { IconButton, useDisclosure,Button,Image,Text } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'

const MyProfile = ({user}) => {
    const {onOpen,isOpen,onClose}=useDisclosure();

  return (
    <div>
      <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
      <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display='flex' justifyContent="center" fontFamily="revert">{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" alignItems='center'>
            <Image borderRadius="full" boxSize="150px" src={user.pic} alt={user.name} marginRight='20px'/>
            <Text fontSize="20px">{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default MyProfile
