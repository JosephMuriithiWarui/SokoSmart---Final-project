const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check if the token exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  // Extract the token part
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info (farmer) to the request
    req.user = decoded;
    next(); // Continue to the next middleware or route
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
