const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

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

app.use(express.static(path.join(__dirname, 'public')));
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
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/api/check-login-status', (req, res) => {
    res.json({ isLoggedIn: !!req.session.isAuthenticated });
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
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});


app.get('/info', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'info.html'));
});

app.get('/data/posts.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'posts.json'));
});

app.get('/grafana', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'grafana.html'));
});

app.get('/incidents', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'incidents.html'));
});

app.get('/spectralnet', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'spectralnet.html'));
});

app.get('/buc', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'buc.html'));
});

app.get('/network', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'network.html'));
});

app.get('/anomalies', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'anomalies.html'));
});

app.get('/procedures', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'procedures.html'));
});

// Protect the form route
app.get('/form', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

// POST route to handle form submissions
app.post('/api/posts', (req, res) => {
    const post = req.body;
    const postsFilePath = path.join(__dirname, 'data', 'posts.json');

    fs.readFile(postsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading posts file:', err);
            return res.status(500).send('Internal Server Error');
        }

        let posts;
        try {
            posts = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Internal Server Error');
        }

        posts.push(post);

        fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                console.error('Error writing to posts file:', err);
                return res.status(500).send('Internal Server Error');
            }

            res.status(201).send('Post created');
        });
    });
});

app.put('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updatedPost = req.body;
    const postsFilePath = path.join(__dirname, 'data', 'posts.json');

    fs.readFile(postsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading posts file:', err);
            return res.status(500).send('Internal Server Error');
        }

        let posts;
        try {
            posts = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Internal Server Error');
        }

        const postIndex = posts.findIndex(post => post.id === id);
        if (postIndex === -1) {
            return res.status(400).send('Invalid post ID');
        }

        posts[postIndex] = updatedPost;

        fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                console.error('Error writing to posts file:', err);
                return res.status(500).send('Internal Server Error');
            }

            res.status(200).send('Post updated');
        });
    });
});

app.delete('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const postsFilePath = path.join(__dirname, 'data', 'posts.json');

    fs.readFile(postsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading posts file:', err);
            return res.status(500).send('Internal Server Error');
        }

        let posts;
        try {
            posts = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Internal Server Error');
        }

        const postIndex = posts.findIndex(post => post.id === id);
        if (postIndex === -1) {
            return res.status(400).send('Invalid post ID');
        }

        posts.splice(postIndex, 1); // Remove the post from the array

        fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                console.error('Error writing to posts file:', err);
                return res.status(500).send('Internal Server Error');
            }

            res.status(200).send('Post deleted');
        });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
