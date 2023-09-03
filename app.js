const express = require('express');
const mongoose = require('mongoose');
require('express-async-errors');
require('dotenv').config();

// extra security packages
const { rateLimit } = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');

// routers and authentication
const isAuth = require('./middleware/is-auth');
const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();

// app.set('trust proxy', 1) // This has to be set if we're gonna deploy to Heroku!
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  })
);
// BY DEFAULT express.json() limits the request body to 100kb and will throw an error if exceeded!
// SO, we don't actually need to do this express.json({ limit: '100kb' })
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', isAuth, jobsRoutes); // YES, WE CAN DO THAT!

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port: ${port}`);
    });
  })
  .catch((err) => console.log(err));
