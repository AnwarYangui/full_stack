const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name !"],
        trim: true,
        maxLength: [100, "Product name cannot exceed 100 characters !"]
    },
    quantity: {
        type: Number,
        required: [true, "Please enter product quantity !"],
        default: 0
    },
    price: {
        type: Number,
        required: [true, "Please enter product price !"],
        default: 0.0
    },
    image: {
        type: String,
        required: false,
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;