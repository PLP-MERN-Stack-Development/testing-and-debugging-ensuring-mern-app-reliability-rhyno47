const app = require('./app');

const PORT = process.env.PORT || 5000;

// Intentionally log useful debug info
console.log(`[DEBUG] Starting server on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || 'development'})`);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
