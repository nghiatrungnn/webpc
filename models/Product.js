// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    quantity: Number,
    category: String,
    image: String, // Thêm trường cho URL ảnh sản phẩm
});

module.exports = mongoose.model('Product', productSchema);
