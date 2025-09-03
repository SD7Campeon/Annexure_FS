require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: process.env.DB_LOGGING === 'true',
  }
);

const Submission = require('./models/Submission')(sequelize);
const Partner = require('./models/Partner')(sequelize);
const TankTruck = require('./models/TankTruck')(sequelize);

async function migrate() {
  const submissions = JSON.parse(fs.readFileSync('submissions_backup.json', 'utf8'));
  for (const submission of submissions) {
    const { partnerDetails, tankTruckDetails, ...submissionData } = submission;
    const newSubmission = await Submission.create(submissionData);
    if (partnerDetails) {
      await Partner.bulkCreate(partnerDetails.map(partner => ({
        ...partner,
        submissionId: newSubmission.id,
      })));
    }
    if (tankTruckDetails) {
      await TankTruck.bulkCreate(tankTruckDetails.map(truck => ({
        ...truck,
        submissionId: newSubmission.id,
      })));
    }
  }
  console.log('Data migration complete');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
