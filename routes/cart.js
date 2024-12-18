const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const isAuthenticated = require('../middleware/auth');

// Giỏ hàng
router.get('/', isAuthenticated, (req, res) => {
    const cart = req.session.cart || [];
    res.render('cart', { title: 'Giỏ Hàng', cart, user: req.session.user });
});

// Thêm sản phẩm vào giỏ hàng
router.post('/add', isAuthenticated, async (req, res) => {
    const productId = req.body.productId; // Lấy productId từ body
    const cart = req.session.cart || [];
    const existingProduct = cart.find(item => item.productId === productId);

    // Tìm sản phẩm trong cơ sở dữ liệu
    const product = await Product.findById(productId);

    if (existingProduct) {
        existingProduct.quantity += 1; // Tăng số lượng nếu sản phẩm đã có
    } else {
        cart.push({ 
            productId, 
            quantity: 1,
            product: {
                name: product.name,
                price: product.price,
                image: product.image // Lưu thông tin hình ảnh
            }
        }); // Thêm sản phẩm mới
    }

    req.session.cart = cart; // Lưu giỏ hàng vào session
    res.redirect('/cart'); // Chuyển hướng về giỏ hàng
});

// Cập nhật số lượng sản phẩm
router.post('/update', isAuthenticated, (req, res) => {
    const { productId, quantity } = req.body;
    const cart = req.session.cart || [];
    const existingProduct = cart.find(item => item.productId === productId);

    if (existingProduct) {
        existingProduct.quantity = quantity;
    }

    req.session.cart = cart;
    res.redirect('/cart');
});

// Xóa sản phẩm khỏi giỏ hàng
router.post('/remove', isAuthenticated, (req, res) => {
    const productId = req.body.productId;
    let cart = req.session.cart || [];
    cart = cart.filter(item => item.productId !== productId);
    
    req.session.cart = cart;
    res.redirect('/cart');
});

module.exports = router;
