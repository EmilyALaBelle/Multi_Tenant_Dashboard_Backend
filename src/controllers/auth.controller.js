const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required "})
        }
        const user = await User.findOne({ email: email.toLowerCase().trim() })

    
    
    if (!user) {
        res.status(401).send({ message: 'Invalid email or password'});
    }

    if (!user.passwordHash) {
        res.status(401).send({ message: 'Invalid email or password'});
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            res.status(401).send({ message: 'Invalid email or password'})
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Server misconfigured (missing JWT_SECRET)" });
        }

        const payload = {
            userId: user._idtoString(),
            role: user.role,
            organizationId: user.organizationId.toString(),
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h" });

        const safeUser = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            organizationId: user.organizationId,
        };

        return res.status(200).json({ user: safeUser, token });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({message: "Server error"});
    }
};