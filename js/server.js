const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

let votes = {};

app.post('/vote', (req, res) => {
    const option = req.body.option;
    if (!votes[option]) {
        votes[option] = 0;
    }
    votes[option]++;
    res.send({ success: true, votes });
});

app.get('/votes', (req, res) => {
    res.send(votes);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
