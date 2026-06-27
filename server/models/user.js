const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "L'adresse email est requise"],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est requis"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);