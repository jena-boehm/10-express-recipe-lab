const express = require('express');
const app = express();

app.use(express.json());

app.use('api/vi/recipes', require('./controllers/recipes'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
