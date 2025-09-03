require('dotenv').config();
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

async function createAdmin() {
  try {
    // Sync the database to ensure the Users table exists
    await sequelize.sync();

    // Check if admin user already exists
    const existingAdmin = await User(sequelize).findOne({ where: { username: process.env.ADMIN_USERNAME } });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await User(sequelize).create({
      username: process.env.ADMIN_USERNAME,
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();