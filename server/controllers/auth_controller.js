const User = require('../models/user');

const signUp = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Veuillez remplir tous les champs." });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }
        const newUser = await User.create({ email, password });
        res.status(201).json({ message: "Compte créé !", userId: newUser._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Veuillez remplir tous les champs." });
        }
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }
        res.status(200).json({ message: "Connexion réussie !", userId: user._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { signUp, signIn };