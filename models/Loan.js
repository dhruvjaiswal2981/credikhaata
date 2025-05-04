const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const moment = require('moment');

const Loan = sequelize.define('Loan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  remainingAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'overdue'),
    defaultValue: 'pending'
  },
  description: {
    type: DataTypes.TEXT
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  hooks: {
    beforeCreate: (loan) => {
      loan.remainingAmount = loan.amount;
    },
    beforeUpdate: (loan) => {
      // Update status based on remaining amount and due date
      if (loan.remainingAmount <= 0) {
        loan.status = 'paid';
      } else if (moment(loan.dueDate).isBefore(moment()) && loan.status !== 'paid') {
        loan.status = 'overdue';
      }
    }
  }
});

module.exports = Loan;