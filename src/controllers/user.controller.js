const User = require("../models/User");
const bcrypt = require("bcrypt");

//Create User **Admin Only**

const createUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access Denied: Admins only" });
        }

        const { name, email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existing = await User.findOne({
            email: normalizedEmail,
            organizationId: req.user.organizationId,
        });

        if (existing) {
            return res.status(409).json({
                message: "A user with this email already exists in your organization",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email: normalizedEmail,
            passwordHash,
            role: role || "member",
            organizationId: req.user.organizationId,
        });

        const safeUser = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            organizationId: newUser.organizationId,
        };

        return res.status(201).json({ user: safeUser });
    } catch (err) {
        console.error("Create User Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

//Read All Users in Organization
const getUsers = async (req, res) => {
    try {
        const users = await User.find({
            organizationId: req.user.organizationId,
        }).select("-passwordHash");

        return res.status(200).json({ users });
    } catch (err) {
        console.error("Get Users Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


//Read Single User by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.id,
            organizationId: req.user.organizationId,
        }).select("-passwordHash");

        if (!user) {
            return res.status(404).json({ message: "User not found"});
        }

        return res.status(200).json({ user });
    } catch (err) {
        console.error("Get User Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


//Update User by ID **Admin Only**

const updateUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Admins Only" });
        }

        const updates = req.body;

        delete updates.organizationId;
        delete updates.passwordHash;

        const user = await User.findOneAndUpdate(
            {
                _id: req.params.id,
                organizationId: req.user.organizationId,
            },
            updates,
            { new: true }
        ).select("-passwordHash");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (err) {
        console.error("Update user error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


//Delete User by ID **Admin Only**
const deleteUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Admins Only"});
        }

        const user = await User.findOneAndDelete({
            _id: req.params.id,
            organizationId: req.user.organizationId,
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User Deleted Successfully" });
    } catch (err) {
        console.error("Delete User Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};