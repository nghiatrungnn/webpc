const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Đăng ký
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.status(400).send('Người dùng đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.redirect('/auth/login');
});

// Đăng nhập
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user; // Lưu thông tin người dùng vào session
        return res.redirect('/');
    }
    res.status(401).send('Đăng nhập không thành công');
});

// Đăng xuất
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); // Xóa cookie phiên
        res.redirect('/auth/login'); // Chuyển hướng người dùng về trang đăng nhập
    });
});

// Trang Đăng Nhập
router.get('/login', (req, res) => {
    res.render('login', { title: 'Đăng Nhập' });
});

// Trang Đăng Ký
router.get('/register', (req, res) => {
    res.render('register', { title: 'Đăng Ký' });
});

// Xem danh sách người dùng
router.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Lấy tất cả người dùng
        res.render('users', { title: 'Danh Sách Người Dùng', users }); // Render trang với danh sách người dùng
    } catch (error) {
        res.status(500).send('Lỗi khi lấy danh sách người dùng');
    }
});

// Sửa người dùng
router.post('/users/edit/:id', async (req, res) => {
    const { username, password } = req.body;
    const { id } = req.params;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(id, { username, password: hashedPassword });
        res.redirect('/auth/users'); // Chuyển hướng về danh sách người dùng
    } catch (error) {
        res.status(500).send('Lỗi khi sửa người dùng');
    }
});

// Xóa người dùng
router.post('/users/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
        res.redirect('/auth/users'); // Chuyển hướng về danh sách người dùng
    } catch (error) {
        res.status(500).send('Lỗi khi xóa người dùng');
    }
});

module.exports = router;
