const Chat = require("../Models/chatModel")
const User = require("../Models/userModel")

const accessChat = async (req, res) => {
    const { userId } = req.body
    if (!userId) {
        return res.status(400).json({ msg: "userId not sent with request" })
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", '-password')
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: "name profile email"
    });

    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        var chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId]
        }
        try {
            const createdChat = await Chat.create(chatData)
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", '-password')
            res.status(200).send(fullChat)
        } catch (error) {
            res.status(500).send(error)
        }
    }
}

const fetchChats = async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name profile email"
                })
                res.status(200).send(results)
            })
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ msg: "Please fill all the fields" })
    }

    var users = JSON.parse(req.body.users)

    if (users.length < 2) {
        return res.status(400).send({ msg: "More than 2 users are required to form a group." })
    }
    users.push(req.user)

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).send(fullGroupChat)
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body
    const updateGroupName = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (updateGroupName) {
        res.status(200).send(updateGroupName)
    }
    else {
        res.status(400).send({ msg: "not updated group name" })
    }
}

const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body
    const addUser = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (addUser) {
        res.status(200).send(addUser)
    }
    else {
        res.status(400).send({ msg: "chat not found" })
    }
}

const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body
    const removeUser = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (removeUser) {
        res.status(200).send(removeUser)
    }
    else {
        res.status(400).send({ msg: "chat not found" })
    }
}

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup }