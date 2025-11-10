const express = require('express');
const cors = require('cors');
const bugsRouter = require('./routes/bugs');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/bugs', bugsRouter);

// Last: error handler
app.use(errorHandler);

module.exports = app;
