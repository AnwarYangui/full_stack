const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createContextArticle, getArticles, getArticleById } = require('../controllers/article_controller');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

router.get('/', getArticles);
router.get('/:id', getArticleById);
router.post('/upload', upload.single('file'), createContextArticle);

module.exports = router;