const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const articleRoutes = require('./routes/article_route');
const questionRoutes = require('./routes/question_route');
const authRoutes = require('./routes/auth_route');

const app = express();

// 1. Middlewares essentiels (CORS configuré pour bloquer les erreurs de ports)
app.use(cors());
app.use(express.json());

// 2. Déclaration des préfixes de routes
app.use("/api/articles", articleRoutes);   // Toutes les routes articles commenceront par /api/articles
app.use("/api/questions", questionRoutes);  // Toutes les routes questions commenceront par /api/questions
app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
  res.send('Serveur DocIA fonctionnel ! 🔬');
});

// Connexion MongoDB (Copie la structure de ton exemple de manière sécurisée)
const MONGO_URI = "mongodb+srv://yenguianwar63_db_user:NMAS5VtZ14Gdcjn6@cluster0.7x2erej.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });