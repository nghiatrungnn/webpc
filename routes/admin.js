// routes/admin.js
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Hiển thị danh sách sản phẩm
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.render('admin/index', { products });
});

// Thêm hoặc sửa sản phẩm
router.get('/product/:id?', async (req, res) => {
    const product = req.params.id ? await Product.findById(req.params.id) : null;
    res.render('admin/product', { product });
});

// Xử lý thêm hoặc sửa sản phẩm
router.post('/product/:id?', async (req, res) => {
    const { name, price, description, quantity, category, image } = req.body;
    if (req.params.id) {
        // Sửa sản phẩm
        await Product.findByIdAndUpdate(req.params.id, { name, price, description, quantity, category, image });
    } else {
        // Thêm sản phẩm
        const newProduct = new Product({ name, price, description, quantity, category, image });
        await newProduct.save();
    }
    res.redirect('/admin');
});

// Xóa sản phẩm
router.post('/delete/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
});

module.exports = router;
