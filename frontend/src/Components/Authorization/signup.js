import {FormControl,FormLabel, VStack,Input, InputGroup, InputRightElement,Button} from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from "axios";

const Signup=()=>{
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [pic,setPic]=useState("");
    const [show,setShow]=useState(false);
    const [show2,setShow2]=useState(false);
    const [loading,setLoading]=useState(false);
    const toast =useToast();
    const history=useHistory();

    const postDetails=(pics)=>{
        setLoading(true);
        if(!pics){
            alert('No picture found');
            return;
        }
        if(pics.type==="image/jpeg"||pics.type==="image/png"){
            const data=new FormData();
            data.append("file",pics);
            data.append("upload_preset","Just Talk");
            data.append("cloud_name","dmj0gwsop");
            data.append("withcredentials",false);
            fetch("https://api.cloudinary.com/v1_1/dmj0gwsop",{
                method:"post",
                body:data
            }).then((res)=>{
                return res.json();
            }).then((d)=>{
                setPic(d.url.toString());
                setLoading(false);
            }).catch((err)=>{
                console.log(err);
                setLoading(false);
            })
        }
        else{
            alert('Image should be in the format of jpeg or png');
            setLoading(false);
            return;
        }
    }
    
    const submitHandler=async ()=>{
        setLoading(true);
        if(!name||!email||!password||!confirmPassword){
            toast({
                title: "Please fill the required fields",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
        try{
            const configuration={
                headers:{
                    "Content-type":"application/json"
                }
            };
            const {data}=await axios.post("/api/user",{
                    name:name,
                    email:email,
                    password:password,
                    pic:pic
            },configuration);
            toast({
                title: "Successfully signed up",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });

            localStorage.setItem('userInfo',JSON.stringify(data));
            setLoading(false);
            window.location.assign("/chats"); // Force full reload to chats page
        } 
        catch(err){
            toast({
                title: "Error",
                description:err.response.data.message,
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }
    }

    return (
        <VStack spacing='5px'>
            <FormControl id='first-name' isRequired>
                <FormLabel color='white'>Name</FormLabel>
                <Input bg='white' placeholder='Enter your name' onChange={(e)=>{
                        setName(e.target.value)
                }}>
                </Input>
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel color='white'>Email</FormLabel>
                <Input bg='white' placeholder='Enter email' onChange={(e)=>{
                        setEmail(e.target.value)
                }}>
                </Input>
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel color='white'>Password</FormLabel>
                <InputGroup>
                    <Input type={show?"text":"password"} bg='white' placeholder='Enter the Password' onChange={(e)=>{
                        setPassword(e.target.value)
                    }}/>
                        <InputRightElement>
                            <Button h='1.75rem' marginRight='5px' onClick={()=> 
                            setShow(!show)}>
                                {show?"Hide":"Show"}
                            </Button>
                        </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='confirm-password' isRequired>
                <FormLabel color='white'>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show2?"text":"password"} bg='white' placeholder='Confirm your Password' onChange={(e)=>{
                        setConfirmPassword(e.target.value)
                    }}/>
                        <InputRightElement>
                            <Button h='1.75rem' marginRight='5px' onClick={()=> 
                            setShow2(!show2)}>
                                {show2?"Hide":"Show"}
                            </Button>
                        </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic'>
                <FormLabel color='white'>Upload your picture</FormLabel>
                <Input type='file' bg='white' accept="images/*" onChange={(e)=>{
                        postDetails(e.target.files[0])
                }}>
                </Input>
            </FormControl><br/>
            <Button colorScheme='blue' onClick={submitHandler} width='100%' isLoading={loading}>
                Sign Up
            </Button>
        </VStack>
    );
}

export default Signup;