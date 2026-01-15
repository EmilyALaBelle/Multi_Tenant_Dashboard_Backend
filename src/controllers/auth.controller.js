const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Organization = require("../models/Organization");


const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required"})
        }
        const user = await User.findOne({ email: email.toLowerCase().trim() })

    
    
    if (!user) {
       return res.status(401).json({ message: 'Invalid email or password'});
    }

    if (!user.passwordHash) {
        return res.status(401).json({ message: 'Invalid email or password'});
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return res.status(401).json({ message: 'Invalid email or password'})
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Server misconfigured (missing JWT_SECRET)" });
        }

        const payload = {
            userId: user._id.toString(),
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


const register = async (req, res) => {
    try {
        const { organizationName, name, email, password } = req.body;

        if (!organizationName || !email || !password ) {
            return res.status(400).json({
                message: "organizationName, email, and password are required",
            });
        }

        if(!process.env.JWT_SECRET) {
            return res
            .status(500)
            .json({ message: "Server misconfigured (missing JWT_SECRET)" })
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({ email: normalizedEmail });
            if(existingUser) {
                return res.status(409).json({ message: "Email is already registered"});
            }

            const org = await Organization.create({
                name: organizationName.trim()
            });

            const passwordHash = await bcrypt.hash(password, 10);

            const user = await User.create({
                name: name ? name.trim() : undefined,
                email: normalizedEmail,
                passwordHash,
                role: "admin",
                organizationId: org._id,
            });

            const payload = {
                userId: user._id.toString(),
                role: user.role,
                organizationId: user.organizationId.toString(),
            };

            const token = jwt.sign( payload, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });

            const safeUser = {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                organizationId: user.organizationId,
            };

            return res.status(201).json({
                organization: { _id: org._id, name: org.name},
                user:safeUser,
                token,
            });
    } catch (err) {
        console.error("Registration error:", err);

        if (err && err.code === 11000) {
            return res.status(409).json({ message: "Email is already registered" });
        }

        return res.status(500).json({ message: "Server error"});
    }
};

module.exports = { userLogin, register };