import bcrypt from 'bcrypt';

// Function to check if the provided password matches the hashed password
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  next();
  return; //DEBUG ONLY!!!
  //TODO:Remove login override

  // if (req.session.isAuthenticated) {
  //   next();
  // } else {
  //   res.status(401).json({ error: 'Authentication required' });
  // }
};

export default {
  verifyPassword,
  isAuthenticated
};
