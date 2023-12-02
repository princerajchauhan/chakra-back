const { signup, login, allUsers, updateProfile } = require("../Conroller/userController")
const authMidd = require("../Middleware/userMiddleware")

const router = require("express").Router()

router.post("/register",signup)
router.post("/login",login)
router.get("/users",authMidd ,allUsers)
router.put("/updateprofile",authMidd ,updateProfile)

module.exports = router