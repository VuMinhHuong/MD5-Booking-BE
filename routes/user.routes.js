const { Router } = require("express");
const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");
console.log("test");
router.get("/", userController.getAll);
router.get("/hompage", userController.getHomePage);
router.get("/posts", userController.getAllPosts);
router.post("/loginUser", userController.login); //nhận thôngh tin về để đối chiếu database
router.post("/createUser", userController.createUser); //nhận thông tin về để so sánh và xử lý trong database
router.post("/resetPassword", userController.resetPassword);
router.post("/newPassword", userController.newPassword);
router.put("/:id", userController.updateUser);

module.exports = router;
