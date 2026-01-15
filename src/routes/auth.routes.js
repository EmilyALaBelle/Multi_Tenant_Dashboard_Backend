const express = require("express");
const { userLogin, register } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", userLogin);
router.post("/register", register );

module.exports = router;