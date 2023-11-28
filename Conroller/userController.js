const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../Models/userModel")

// const arr = []

// secretKey = "asldfhkasdfhiasdjuhfiasebfasodhfasdfsdf"

const signup = async (req, res) => {
    try {
        const detail = req.body
        // console.log(detail)
        const dupicate = await User.findOne({ email: detail.email })
        if (dupicate) {
            return res.send({ msg: "user already registered with this email", msg2: false })
        }
        const hashPassword = await bcrypt.hash(detail.password, 10)
        detail.password = hashPassword
        // detail.pic = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        const user = await User.create({ ...detail })
        if (!user) {
            return res.status(400).send({ msg: "Failed to create user" })
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "24h" })
        res.status(200).send({ msg: "user registered successfully", msg2: true, user, token })
    } catch (error) {
        res.status(500).send({ msg: error })
    }
}

const login = async (req, res) => {
    const details = req.body
    // console.log(details)
    const find = await User.findOne({ email: details.email })
    if (!find) {
        return res.send({ msg: "you are not a registered user", msg2: false })
    }
    const validpass = await bcrypt.compare(details.password, find.password)
    if (!validpass) {
        return res.send({ msg: "your email and password does not match", msg2: false })
    }
    const token = jwt.sign({ id: find._id }, process.env.SECRET_KEY, { expiresIn: "24h" })
    res.status(200).send({ msg: "user successfully logged in", msg2: true, user: find, token: token })
}

//  SEARCH USER
const allUsers = async (req, res) => {
    // console.log(req.query.search)
    const search = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ],
    } : {}
    const users = await User.find(search).find({_id: {$ne: req.user._id}})
    res.status(200).send(users)
}

module.exports = { signup, login, allUsers }