const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.cookies && req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    const secret = process.env.JWT_SECRET || 'changeme_dev_secret';
    const payload = jwt.verify(token, secret);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    console.error('Auth verify error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
