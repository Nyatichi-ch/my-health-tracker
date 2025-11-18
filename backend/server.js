require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.ATLAS_URI;
const env = process.env.NODE_ENV;

// middleware
app.use(cors());
app.use(express.json());

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
app.use('/api/entries', entriesRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
