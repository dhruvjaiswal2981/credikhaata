const sequelize = require('../config/database');
const User = require('./User');
const Customer = require('./Customer');
const Loan = require('./Loan');
const Repayment = require('./Repayment');

// Define relationships
User.hasMany(Customer, { foreignKey: 'userId' });
Customer.belongsTo(User, { foreignKey: 'userId' });

Customer.hasMany(Loan, { foreignKey: 'customerId' });
Loan.belongsTo(Customer, { foreignKey: 'customerId' });

Loan.hasMany(Repayment, { foreignKey: 'loanId' });
Repayment.belongsTo(Loan, { foreignKey: 'loanId' });

module.exports = {
  sequelize,
  User,
  Customer,
  Loan,
  Repayment
};