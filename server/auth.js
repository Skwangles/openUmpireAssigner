const bcrypt = require('bcrypt');

// Function to check if the provided password matches the hashed password
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  verifyPassword,
};
