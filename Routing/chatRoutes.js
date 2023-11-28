const chatCont = require("../Conroller/chatController")
const authMidd = require("../Middleware/userMiddleware")

const chatRoute = require("express").Router()


chatRoute.post("/access", authMidd, chatCont.accessChat)
chatRoute.get("/fetch", authMidd, chatCont.fetchChats)
chatRoute.post("/group", authMidd, chatCont.createGroupChat)
chatRoute.put("/rename", authMidd, chatCont.renameGroup)
chatRoute.put("/groupadd", authMidd, chatCont.addToGroup)
chatRoute.put("/groupremove", authMidd, chatCont.removeFromGroup)

module.exports = chatRoute