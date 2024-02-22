import http from "http"
import { Server as SocketIOServer, Socket } from "socket.io";
import Message from "../models/message";
import User from "../models/user";


export const startWebSocketServer = (server: http.Server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });

    io.on("connection", (socket: Socket) => {
        console.log("Client connected to websocket server");

        socket.on("saveMessage", async (message) => {
            console.log("Message received on server: ", message)
            const newMsg = new Message({
                content: message.content,
                sender: message.sender,
                receiver: message.receiver,
            })

            const dbmsg = await newMsg.save();
            io.emit("messageSaved", dbmsg);
        })
        
        socket.on("getAllUsers", async () => {
            console.log("Getting all users from server");

            const users = await User.find();
            socket.emit("allUsers", users)
        })

        socket.on("getAllMessages", async () => {
            console.log("Getting all messages from server");

            const messages = await Message.find();
            socket.emit("allMessages", messages);
        })

        socket.on("disconnect", () => {
            console.log("Client disconnected from websocket server");
        })
    })
}