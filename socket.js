let io;
const options={
    cors:true,
    origins:["http://localhost:3000"],
   }
module.exports={
    init : httpServer=>{
       io= require('socket.io')(httpServer,options)
        return io;
    },
    getIO:()=>{
        if(!io){
            throw new Error("Socket IO not initialized");
        }
        else{
            return io;
         }
    }
};