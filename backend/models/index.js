require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

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

// Initialize models
const Submission = require('./Submission')(sequelize, DataTypes);
const Partner = require('./Partner')(sequelize, DataTypes);
const TankTruck = require('./TankTruck')(sequelize, DataTypes);
const User = require('./User')(sequelize, DataTypes);

// Register associations
if (Submission.associate) {
  Submission.associate({ Partner, TankTruck, User });
}
if (Partner.associate) {
  Partner.associate({ Submission });
}
if (TankTruck.associate) {
  TankTruck.associate({ Submission });
}
if (User.associate) {
  User.associate({ Submission });
}

module.exports = {
  sequelize,
  Sequelize,
  Submission,
  Partner,
  TankTruck,
  User,
};
