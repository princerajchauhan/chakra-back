const express = require("express")
const router = require("./Routing/userRouter")
const cors = require("cors")
const connectToDb = require("./DB/connection")
const colors = require("colors")
const chatRoute = require("./Routing/chatRoutes")
const messageRoute = require("./Routing/messageRoute")
const socket = require("socket.io")

require("dotenv").config()

const port = process.env.PORT || 3008

const server = express()
server.use(cors())

server.use(express.json())

server.use("/api", router)
server.use("/chat", chatRoute)
server.use("/message", messageRoute)


const startConnection = async () => {
    try {

        await connectToDb(process.env.Mongo_URI)

        const app = server.listen(port, () => {
            console.log(`Server is running on port: ${port}`.blue)
        })

        const io = socket(app, {
            // pingTimeout: 60000,
            cors: {
                origin: "https://prince-chat.vercel.app/"
            }
        })

        io.on("connection", (socketClient) => {
            console.log("Connected to socket.io")

            socketClient.on("setup", (userData) => {
                socketClient.join(userData._id);
                socketClient.emit("connected");
            })

            socketClient.on("joinRoom", (room) => {
                socketClient.join(room)
                console.log("User joined room: ",room)
            })

            socketClient.on("typing", room => socketClient.in(room).emit("typing"))
            socketClient.on("stop typing", room => socketClient.in(room).emit("stop typing"))

            socketClient.on("newMessage", newMessageReceived => {
                var chat = newMessageReceived.chat

                if (!chat.users) return console.log("chat.users is not defined");

                chat.users.forEach(user => {
                    if (user._id === newMessageReceived.sender._id) return;
                    socketClient.in(user._id).emit("message received", newMessageReceived)
                })
            })

            socketClient.off("setup", () => {
                console.log("user disconnected")
                socketClient.leave(userData._id)
            })
        })

    } catch (error) {
        console.log(error)
    }
}
startConnection()