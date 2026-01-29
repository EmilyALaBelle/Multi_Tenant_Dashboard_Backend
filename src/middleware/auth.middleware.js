const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({message: "Missing or Invalid Authorization Header"});
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Missing Token"});
        }

        if (!process.env.JWT_SECRET) {
            return res
            .status(500)
            .json({ message: "Server misconfigured (missing JWT_SECRET)"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        return next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or Expired Token "});
    }
};

module.exports = { requireAuth };