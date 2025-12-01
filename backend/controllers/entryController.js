const Entry = require('../models/Entry');

// Create new entry
exports.createEntry = async (req, res) => {
  try {
    const { water, exercise, sugar } = req.body;
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const newEntry = new Entry({ user: userId, water, exercise, sugar });
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
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const entries = await Entry.find({ user: userId }).sort({ createdAt: -1 }).limit(100);
    return res.json(entries);
  } catch (err) {
    console.error('Error fetching entries :', err);
    return res.status(500).json({ error: 'Failed to fetch entries' });
  }
};
