require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Setup Socket.IO with CORS   
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Express Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Share Socket.IO instance
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api', require('./routes/auth'));

// Sequelize setup
const { sequelize } = require('./models');
sequelize.sync({ alter: true }).then(() => {
  console.log('DB synced');
}).catch(err => {
  console.error('DB sync failed:', err);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});