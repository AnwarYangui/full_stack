const Article = require('../models/article');

const createContextArticle = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Veuillez joindre un document." });
        }
        const { apiKey, userId } = req.body; 
        if (!userId) {
            return res.status(400).json({ message: "Utilisateur non identifié." });
        }

        const article = await Article.create({
            userId: userId,
            filename: req.file.filename,
            path: req.file.path,
            hasApiKeyAttached: apiKey ? true : false
        });

        res.status(200).json({ message: "Article enregistré !", articleId: article._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getArticles = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: "userId requis pour l'historique." });
        }
        const articles = await Article.find({ userId: userId }).sort({ createdAt: -1 });
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findById(id);
        if (!article) return res.status(404).json({ message: "Article introuvable" });
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createContextArticle, getArticles, getArticleById };