const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Submission = sequelize.define('Submission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    namePrefix: {
      type: DataTypes.ENUM('MR.', 'MS.'),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    relationPrefix: {
      type: DataTypes.ENUM('S/O', 'D/O', 'W/O'),
      allowNull: false,
    },
    fatherOrHusbandName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firmName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firmAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sapCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vendorCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    agreementDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    noOfTrucks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[1, 2, 3]],
      },
    },
  });

  Submission.associate = (models) => {
    Submission.belongsTo(models.User, { foreignKey: 'userId' });
    Submission.hasMany(models.Partner, { foreignKey: 'submissionId', as: 'partnerDetails' });
    Submission.hasMany(models.TankTruck, { foreignKey: 'submissionId', as: 'tankTruckDetails' });
  };

  return Submission;
};