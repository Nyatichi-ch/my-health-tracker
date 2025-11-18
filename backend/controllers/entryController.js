const Entry = require('../models/Entry');

// Create new entry
exports.createEntry = async (req, res) => {
  try {
    const { water, exercise, sugar } = req.body;
    const newEntry = new Entry({ water, exercise, sugar });
    await newEntry.save();
    return res.status(201).json(newEntry);
  } catch (err) {
    console.error('Error creating entry :', err);
    res.status(500).json({ error: 'Failed to create entry' });
  }
};

// Get recent entries
exports.getEntries = async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 }).limit(100);
    return res.json(entries);
  } catch (err) {
    console.error('Error fetching entries :', err);
    return res.status(500).json({ error: 'Failed to fetch entries' });
  }
};
