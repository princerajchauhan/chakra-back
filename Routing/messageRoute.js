const { sendMessage, allMessage } = require("../Conroller/messageController")
const authMidd = require("../Middleware/userMiddleware")

const route = require("express").Router()

route.post("/send", authMidd, sendMessage)
route.get("/allmsg/:chatId", authMidd, allMessage)

module.exports = route