const mongoose = require("mongoose")
const { Schema, model } = require("mongoose")

const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    name: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: [ "admin", "member" ],
        default: "member",
        required: true
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        index: true
    }
}, { timestamps: true }
);

const User = model('User', userSchema);
module.exports = User;