const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: [true, "La question doit être liée à un article"]
    },
    text: {
        type: String,
        required: [true, "Le texte de la question ne peut pas être vide !"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);