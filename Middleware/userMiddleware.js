const User = require("../Models/userModel")
const jwt = require("jsonwebtoken")

const authMidd = async(req, res, next) =>{
    const bearer = req.headers["authorization"]
    if (!bearer) {
        return res.send({msg: "no token"})
    }
    const token = bearer.split(' ')[1]
    if (!token) {
        return res.send({msg: "user is not a authorised person, token failed"})
    }
    const validate = jwt.verify(token, process.env.SECRET_KEY)
    req.user = await User.findById(validate.id).select("-password")
    if (validate) {
        return next()
    }
    res.send({msg: 'user not authorized person'})
}

module.exports = authMidd