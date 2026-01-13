const mongoose = require("mongoose")
const { Schema, model } = require("mongoose")

const organizationSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const Organization = model('Organization', organizationSchema);
module.exports =  Organization;