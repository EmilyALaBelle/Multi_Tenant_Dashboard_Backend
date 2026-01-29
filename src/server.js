const express = require("express");
require("dotenv").config();
const { connectionToMongodb } = require("./config/db.js");
const authRoutes = require("./routes/auth.routes");

const PORT = process.env.PORT || 3200
const app = express();
const { requireAuth } = require("./middleware/auth.middleware.js");
// const User = require("./models/User");
const Organization = require("./models/Organization");
const userRoutes = require("./routes/user.routes");
const orgRoutes = require("./routes/org.routes");

app.use(express.json())

app.use("/api/users", userRoutes);

app.use("/api/org", orgRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok'})
});

app.get("/api/me", requireAuth, (req, res) => {
    res.status(200).json({ user: req.user });
});

// app.get("/api/me", requireAuth, async (req, res) => {
//     const user = await User.findById(req.user.userId).select(-passwordHash);
//     res.json({ user });
// });

// app.get("api/me", requireAuth, async (req, res) => {
//     try {
//         const user = await User.findById(req.user.userId).select("-passwordHash");
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         return res.status(200).json({ user });
//     } catch (err) {
//         console.error("GET /api/me error:" err);
//         return res.status(500).json({ message: "Server error" });
//     }
// });

app.get("/api/org", requireAuth, async (req, res) => {
    try {
        const org = await Organization.findById(req.user.organizationId);
        if (!org) {
            return res.status(404).json({ message: "Organization not found" });
        }
        return res.status(200).json({ organization: org });
    } catch (err) {
        console.error("GET /api/org error:", err);
        return res.status(500).json({ message: "server error" });
    }
});

app.use("/api/auth", authRoutes);

const start = async () => {
    try {
        await connectionToMongodb()
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
};
start();
