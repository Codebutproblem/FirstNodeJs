const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({
    title: String,
    permissions: {
        type: Array,
        default: []
    },
    description: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
}, { timestamps: true });

const Role = mongoose.model("Roles", roleSchema, "roles");

module.exports = Role;