'use strict';
module.exports = (sequelize, DataTypes) => {
  const UnitStations = sequelize.define('UnitStations', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    stationName: DataTypes.STRING,
    dailyTarget: DataTypes.FLOAT,
    monthlyTarget: DataTypes.FLOAT
  }, {});
  UnitStations.associate = function(models) {
    // associations can be defined here
    UnitStations.hasMany(models.Loans)
  };
  return UnitStations;
};