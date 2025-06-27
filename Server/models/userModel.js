import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true
    },
    emergencyContact: {
        name: {
            type: String
        },
        relation: {
            type: String
        },
        phone: {
            type: String,
        }
    },
    profileImage: {
        type: String,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;