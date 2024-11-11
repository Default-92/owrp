const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // To parse JSON bodies

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve the form page
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

// Serve the info page
app.get('/info', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'info.html'));
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
