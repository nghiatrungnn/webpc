const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/admin'); // Import các route admin
const path = require('path');
require('dotenv').config();

const app = express();

// Kết nối đến MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');

app.use('/auth', authRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter); // Đảm bảo đường dẫn đúng
app.use('/admin', adminRoutes);
app.use('/', indexRouter);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
