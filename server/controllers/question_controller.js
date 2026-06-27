const Question = require('../models/question');

const createQuestion = async (req, res) => {
    try {
        const { articleId, question } = req.body;
        if (!question) {
            return res.status(400).json({ message: "La question ne peut pas être vide" });
        }

        const newQuestion = await Question.create({
            articleId: articleId,
            text: question
        });

        res.status(200).json({ 
            message: "Question enregistrée !", 
            answer: `[Serveur] Question synchronisée en BDD sous l'ID ${newQuestion._id}.`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getQuestionsByArticle = async (req, res) => {
    try {
        const { articleId } = req.params;
        const questions = await Question.find({ articleId: articleId });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createQuestion, getQuestionsByArticle };