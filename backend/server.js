const express=require('express');

const dotenv=require('dotenv');
const connectDB=require('./config/db.js');
const userRoutes=require('./routes/userRoutes');
const {notFound,errorHandler}=require('./middlewares/errorMid.js')
const chatRoutes=require('./routes/chatRoutes');
const messageRoutes=require('./routes/messageRoutes');
const path=require('path');

dotenv.config({path:`./c.env`});
connectDB();
const app=express();

app.use(express.json());

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);
app.use(notFound);
app.use(errorHandler);

const __dirname1=path.resolve();
if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname1,"/frontend/build")));
    app.get("*",(req,res)=>{
        console.log('kha kha')
        res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"));
    })
}else{
    app.get('/',(req,res)=>{
        console.log('Server is running fine');
    })
}

const PORT=process.env.PORT||8000;

const server=app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});

const io=require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
        origin:'http://localhost:3000'
    }
});

io.on("connection",(socket)=>{
    console.log('web socket connected');

    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        socket.emit('connected');
    })

    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log('User joined room '+room);
    })

    socket.on('typing',(room)=> socket.in(room).emit('typing'));
    socket.on('stop typing',(room)=> socket.in(room).emit('stop typing'));

    socket.on('new message',(newMessageRecieved)=>{
        var chat=newMessageRecieved.chat;

        if(!chat.users)  return console.log('chat.users not defined');

        chat.users.forEach((user) => {
            if(user._id===newMessageRecieved.sender._id) return;

            socket.in(user._id).emit('message recieved',newMessageRecieved);
        });
    })

    socket.off('setup',()=>{
        socket.leave(userData._id);
    })
});