const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Product = require('./models/product');
const productRoutes = require('./routes/product_route');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());

//routes
app.use("/api/products",productRoutes);


//test
app.get('/', (req, res) => {
  res.send('Hello World! ');
});

//mongodb connection
mongoose.connect("mongodb+srv://yenguianwar63_db_user:WtflIQy0LQvyMqWW@backend.ozvxgnt.mongodb.net/nodeapi")  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });