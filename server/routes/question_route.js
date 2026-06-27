const express = require('express');
const router = express.Router();
const { createQuestion, getQuestionsByArticle } = require('../controllers/question_controller');

router.post('/', createQuestion);
router.get('/article/:articleId', getQuestionsByArticle);

module.exports = router;