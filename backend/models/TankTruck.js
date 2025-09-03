const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TankTruck = sequelize.define('TankTruck', {
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
    srNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[1, 2, 3]],
      },
    },
    registrationNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    yearOfManufacture: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1900,
        max: new Date().getFullYear(),
      },
    },
    registrationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.ENUM('12 KL', '14 KL', '20 KL'),
      allowNull: false,
    },
    pesoLicenseNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registeredOwner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    relationship: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookedNos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[1, 2, 3]],
      },
    },
    bookedCapacity: {
      type: DataTypes.ENUM('12 KL', '14 KL', '20 KL'),
      allowNull: false,
    },
    makeModel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    supplierName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoiceReference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return TankTruck;
};