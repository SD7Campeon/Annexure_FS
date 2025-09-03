const jwt = require('jsonwebtoken');
const createErrorResponse = (message, code) => ({
  error: { message, code }
});

const authMiddleware = (roles = ['admin']) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json(createErrorResponse('No token provided', 'UNAUTHORIZED'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json(createErrorResponse('Invalid or expired token', 'INVALID_TOKEN'));
    }
    if (!roles.includes(user.role)) {
      return res.status(403).json(createErrorResponse('Insufficient permissions', 'FORBIDDEN'));
    }
    req.user = user;
    next();
  });
};

module.exports = { authMiddleware };
