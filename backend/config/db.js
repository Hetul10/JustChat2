const mongoose=require(`mongoose`);

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.URL)
        console.log(`Database connection succesful`);
    }
    catch(error){
        console.log(error);
        process.exit();
    }
}

module.exports=connectDB;