const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

const app = express();
app.use((req, res, next) => { console.log('[DEBUG-SERVER REQ]', req.method, req.originalUrl); next(); });
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

const PORT = 6000;
app.listen(PORT, () => {
    console.log('Debug server listening on', PORT);
});
