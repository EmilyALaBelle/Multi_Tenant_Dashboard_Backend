const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userLogin = async (req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({ email })
    const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            res.status(401).send({ message: 'Invalid email or password'})
            return
        }
        const token = jwt.sign(user._id, user.role, user.organizationId, process.env.JWT_SECRET)
        res.send({ _id, email, name, role, organizationId, token})
}