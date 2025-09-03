const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Partner = sequelize.define('Partner', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    submissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Submissions',
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
    residentialAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('Partner', 'Proprietor'),
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
    caste: {
      type: DataTypes.ENUM('GEN', 'OBC', 'SC', 'ST'),
      allowNull: false,
    },
  });

  return Partner;
};