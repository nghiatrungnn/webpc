const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Trang chủ
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.render('index', { title: 'Trang Chủ', products, user: req.session.user });
});

// Xem thông tin sản phẩm
router.get('/product/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    console.log(product); // Kiểm tra xem mô tả có trong sản phẩm không
    res.render('product', { title: 'Chi Tiết Sản Phẩm', product, user: req.session.user });
});


// API để lấy danh sách sản phẩm
router.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy sản phẩm' });
    }
});

module.exports = router;
