const { signup, login, allUsers, updateProfile } = require("../Conroller/userController")
const authMidd = require("../Middleware/userMiddleware")

const router = require("express").Router()

router.post("/register",signup)
router.post("/login",login)
router.get("/users",authMidd ,allUsers)
router.post("/updateprofile",authMidd ,updateProfile)

module.exports = router