'use strict';
module.exports = (sequelize, DataTypes) => {
  const Loans = sequelize.define('Loans', {
    loanDate: DataTypes.DATE,
    dueDate: DataTypes.DATE,
    loanCode: DataTypes.STRING,
    loanAmount: DataTypes.FLOAT,
    customerStation: DataTypes.INTEGER,
    customerId: DataTypes.INTEGER,
    loanStatus: DataTypes.INTEGER
  }, {});
  Loans.associate = function(models) {
    // associations can be defined here
    Loans.belongsTo(models.UnitStations, {
      as: 'unitStationsId'
    });
    Loans.belongsTo(models.LoanStatus,{
      as: 'loanStatusId'
    });
  };
  return Loans;
};