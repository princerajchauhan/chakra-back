
const Chat = require("../Models/chatModel")
const Message = require("../Models/msgModel")
const User = require("../Models/userModel")


const sendMessage = async (req, res) => {
    const { message, chatId } = req.body
    if (!message || !chatId) {
        return res.send({ msg: "Invalid data passed" })
    }

    var newMsg = {
        sender: req.user._id,
        message: message,
        chat: chatId
    }

    try {
        var msg = await Message.create(newMsg)
        msg = await msg.populate("sender", "name profile")
        msg = await msg.populate("chat")
        msg = await User.populate(msg, {
            path: "chat.users",
            select: "name profile email"
        })

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latesMessage: msg
        })

        res.json(msg)

    } catch (error) {
        res.status(400).send({ msg: "Error sending message" })
    }
}

const allMessage = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
                        .populate("sender", "name profile email")
                        .populate("chat")
        res.json(messages)
    } catch (error) {
        res.status(400).send({msg: error.message})
    }
}

module.exports = { sendMessage, allMessage }