const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Hardcoded credentials
const USERNAME = 'admin';
const PASSWORD = 'smalahove';

// Configure session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to protect routes
function ensureAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.redirect('/login');
}

// Routes
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === USERNAME && password === PASSWORD) {
        req.session.isAuthenticated = true;
        res.redirect('/form');
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Protect the form route
app.get('/form', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
