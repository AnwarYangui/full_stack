const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "L'article must be lié à un utilisateur"]
    },
    filename: {
        type: String,
        required: [true, "Le nom du fichier est requis"]
    },
    path: {
        type: String,
        required: [true, "Le chemin du fichier est requis"]
    },
    hasApiKeyAttached: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);