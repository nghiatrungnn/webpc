module.exports = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Chưa đăng nhập thì chuyển về trang login
    }
    next();
};
