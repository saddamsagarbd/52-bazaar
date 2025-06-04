const express = require("express");
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

router.post("/api/users/", createUser);
router.get("/api/users/", getUsers);
router.get("/api/users/:id", getUserById);
router.put("/api/users/:id", updateUser);
router.delete("/api/users/:id", deleteUser);

module.exports = router;