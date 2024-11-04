const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serveren kjører på port ${3001}`);
});