const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();
const { migrate } = require('./migrate');
const morgan = require('morgan');
const logger = require('./logger');

const authRouter = require('./routes/auth.router');
const searchRouter = require('./routes/search.router');
const { router: platformRouter } = require('./routes/platform.router');

const app = express();
if (process.env.TRUSTED_PROXY) app.set('trust proxy', process.env.TRUSTED_PROXY.split(','));
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: false, limit: '64kb' }));
app.use(morgan('combined', {
	stream: {
		write: (msg) => logger.info(msg.trim())
	}
}));

// Serve uploaded assets (avatars) from project-level uploads dir
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRouter);
// Support both /api/search (intended) and /search (if upstream strips prefix)
app.use('/api/search', searchRouter);
app.use('/search', searchRouter);
app.use('/api', platformRouter);
app.use('/api/payments', require('./routes/payments.router'));
app.use('/api/admin', require('./routes/admin.router'));
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(err.status || 500).json({ message: err.status ? err.message : 'Unable to complete the request. Please try again.' });
});

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
