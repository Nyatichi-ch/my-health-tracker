require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
mongoose.set('strictQuery', false);

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.ATLAS_URI;
const env = process.env.NODE_ENV;

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000', credentials: true }));

// connect to MongoDB
mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// routes
const entriesRouter = require('./routes/entries');
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);
app.use('/api/entries', entriesRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
