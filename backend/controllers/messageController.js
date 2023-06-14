const asyncHandler = require("express-async-handler");
const Massage=require('../models/messageModel');
const Chat = require("../models/schema");
const User = require("../models/userModel");


const sendMessage=asyncHandler(async(req,res)=>{
    const {content,chatId}=req.body;

    if(!content||!chatId){
        console.log('Invalid data passed!');
        return res.sendStatus(400);
    }

    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId
    }
    try{
        var message=await Massage.create(newMessage);

        message=await message.populate('sender','name');
        message=await message.populate('chat');
        message=await User.populate(message,{
            path:'chat.users',
            select:'name pic email'
        });
        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
        });
        res.json(message);
    } catch(error){
        res.status(400);
        console.log(error);
        throw new Error(console.error.message);
    }
});

const allMessages=asyncHandler(async(req,res)=>{
    console.log(req.params);
    try{
        const messages=await Massage.find({chat:req.params.chatId}).populate('sender','name pic email').populate('chat');
        res.json(messages);
    } catch(err){
        res.status(400);
        throw new Error(err.message);
    }
})

module.exports={sendMessage,allMessages};