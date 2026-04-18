const jwt = require('jsonwebtoken');

// Protect route - check if user is logged in
const protect = (req, res, next) => {
  try {
    // Get token from request header
    const token = req.headers.authorization?.split(' ')[1];

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    // Move to next function
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Authorize roles - check if user has the right role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Only ${roles.join(', ')} can access this route.` 
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };