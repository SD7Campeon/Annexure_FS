// Save as test.js in backend
const bcrypt = require('bcrypt');
bcrypt.compare('secure_admin_password123', '$2b$10$z7QPu3ucMC6tbDjUz2VJkOsNv9pCoY3ygEl/i8iO1jIT0AoPv8PI2', (err, result) => {
  console.log('Password match:', result);
});