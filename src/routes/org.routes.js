const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const Organization = require("../models/Organization");

const router = express.Router();

// GET /api/org (tenant-derived)
router.get("/", requireAuth, async (req, res) => {
  try {
    const org = await Organization.findById(req.user.organizationId);

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    return res.status(200).json({
      organization: {
        _id: org._id,
        name: org.name,
        createdAt: org.createdAt,
        updatedAt: org.updatedAt,
      },
    });
  } catch (err) {
    console.error("GET /api/org error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/org (admin-only rename)
router.patch("/", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Organization name is required" });
    }

    const org = await Organization.findByIdAndUpdate(
      req.user.organizationId,       // ✅ derived from token
      { name: name.trim() },
      { new: true }
    );

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    return res.status(200).json({
      organization: {
        _id: org._id,
        name: org.name,
        createdAt: org.createdAt,
        updatedAt: org.updatedAt,
      },
    });
  } catch (err) {
    console.error("PATCH /api/org error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
