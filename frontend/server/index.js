const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();
const { migrate } = require('./migrate');

const authRouter = require('./routes/auth.router');
const searchRouter = require('./routes/search.router');
const operatorRouter = require('./routes/operator.router');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve uploaded assets (avatars)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api/search', searchRouter);
app.use('/api/operator', operatorRouter);

app.get('/', (req, res) => res.json({ service: 'ndlela-search-engine', status: 'ok' }));
app.get('/health', (req, res) => res.json({ status: 'healthy' }));

const port = process.env.PORT || 3001;

// Run DB migrations before starting server
migrate()
	.then(() => {
		app.listen(port, () => console.log(`Server listening on ${port}`));
	})
	.catch((err) => {
		console.error('Migration failed:', err);
		process.exit(1);
	});
