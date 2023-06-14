import {Container,Box,Text} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Login from "../Components/Authorization/login";
import SignUp from "../Components/Authorization/signup";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const HomePage=()=>{
    const history=useHistory();

    useEffect(()=>{
        const userInfo= JSON.parse(localStorage.getItem("userInfo"));

        if(userInfo){
            history.push("/chats");
        }
    },[history]);

    return(
        <Container maxW='xl' centerContent>
            <Box d='flex' justifyContent='center' p='3' bg='rgb(0,0,0,0.5)' w='100%' m='40px 0 15px 0' borderRadius='10px' borderWidth='3px'>
                <Text fontFamily='fantasy' color='lightblue' fontSize='4xl'align='center'>Just-Talk</Text>
            </Box>
            <Box bg='rgb(0,0,0,0.5)' p='4' w='100%' m='20px 0 15px 0' borderRadius='15px' borderWidth='1px'>
                <Tabs variant='soft-rounded' colorScheme='blue'>
                    <TabList>
                        <Tab color='white' margin='auto'>Login</Tab>
                        <Tab color='white' margin='auto'>Sign-up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login/>
                        </TabPanel>
                        <TabPanel>
                            <SignUp/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage;