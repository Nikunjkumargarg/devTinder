const express = require('express');
require('dotenv').config();
const dbConnect = require('./config/database');
const cookieParser = require('cookie-parser');
const http = require('http');
const initializeSocket = require('./utils/socket');
const cors = require('cors');
require('./utils/cronJob');
const app = express();


app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true,
  }
))

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestsRouter = require('./routes/requests');
const userRouter = require('./routes/user');
// const paymentRouter = require('./routes/payment');

// Health check route
app.get('/health', (req, res) => {
  res.send({ status: 'OK', message: 'Server is running' });
});

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestsRouter);
app.use('/', userRouter);
// app.use('/', paymentRouter);

// Catch-all route for undefined endpoints
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send({ error: err.message || 'Internal server error' });
});

const server = http.createServer(app);
initializeSocket(server);

dbConnect()
  .then(() => {
    console.log('Database connected');
    server.listen(process.env.PORT, () => {
      console.log(`Application is listening on port no ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
