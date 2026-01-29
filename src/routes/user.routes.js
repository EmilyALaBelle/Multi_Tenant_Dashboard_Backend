const express = require('express');
const requireAuth = require("../middleware/requireAuth");

const {
    createUser,
    GetUsers,
    GetUserById,
    UpdateUser,
    DeleteUser,
} = require("../controllers/user.controller");

const router = express.Router();

router.use(requireAuth);

router.post("/", createUser);
router.get("/", GetUsers);
router.get("/:id", GetUserById);
router.put("/:id", UpdateUser);
router.delete("/:id", DeleteUser);

module.exports = router;