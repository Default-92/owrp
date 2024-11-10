const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // To parse JSON bodies

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
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

app.get('/form', (req, res) => {
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

        const posts = JSON.parse(data);
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
    console.log(`Serveren kjører på port ${PORT}`);
});
