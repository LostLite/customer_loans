'use strict';
module.exports = (sequelize, DataTypes) => {
  const LoanStatus = sequelize.define('LoanStatus', {
    status: DataTypes.STRING
  }, {});
  LoanStatus.associate = function(models) {
    // associations can be defined here
    LoanStatus.hasMany(models.Loans)
  };
  return LoanStatus;
};