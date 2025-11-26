const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRouter = require('./routes/auth.router');
const searchRouter = require('./routes/search.router');
const operatorRouter = require('./routes/operator.router');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/search', searchRouter);
app.use('/api/operator', operatorRouter);

app.get('/', (req, res) => res.json({ service: 'satourism-server', status: 'ok' }));
app.get('/health', (req, res) => res.json({ status: 'healthy' }));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server listening on ${port}`));
