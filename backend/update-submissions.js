const { sequelize } = require('./models');

async function updateSubmissions() {
  try {
    const [results, metadata] = await sequelize.query(`
      UPDATE Submissions
      SET userId = (SELECT id FROM Users WHERE role = 'admin' LIMIT 1)
      WHERE userId IS NULL;
    `);
    console.log(`Submissions updated: ${metadata.affectedRows} rows affected`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating submissions:', error);
    process.exit(1);
  }
}

updateSubmissions();