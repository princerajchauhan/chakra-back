const { signup, login, allUsers } = require("../Conroller/userController")
const authMidd = require("../Middleware/userMiddleware")

const router = require("express").Router()

router.post("/register",signup)
router.post("/login",login)
router.get("/users",authMidd ,allUsers)

module.exports = router