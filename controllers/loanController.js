const { Loan, Customer, Repayment } = require('../models');
const moment = require('moment');
const loanService = require('../services/loanService');
const notificationService = require('../services/notificationService');

exports.getAllLoans = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    const where = { userId: req.user.id };
    if (status) where.status = status;

    const loans = await Loan.findAll({
      include: [{
        model: Customer,
        where: { userId: req.user.id },
        attributes: ['id', 'name', 'phone']
      }, {
        model: Repayment,
        attributes: ['id', 'amount', 'paymentDate']
      }],
      order: [['dueDate', 'ASC']]
    });

    res.status(200).json({
      status: 'success',
      results: loans.length,
      data: {
        loans
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findOne({
      where: { id: req.params.id },
      include: [{
        model: Customer,
        where: { userId: req.user.id },
        attributes: ['id', 'name', 'phone']
      }, {
        model: Repayment,
        attributes: ['id', 'amount', 'paymentDate', 'notes']
      }]
    });

    if (!loan) {
      return res.status(404).json({
        status: 'fail',
        message: 'No loan found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        loan
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.createLoan = async (req, res, next) => {
  try {
    const { customerId, amount, dueDate, description } = req.body;

    // Check if customer belongs to the user
    const customer = await Customer.findOne({
      where: {
        id: customerId,
        userId: req.user.id
      }
    });

    if (!customer) {
      return res.status(404).json({
        status: 'fail',
        message: 'No customer found with that ID'
      });
    }

    const newLoan = await Loan.create({
      customerId,
      amount,
      dueDate,
      remainingAmount: amount,
      description
    });

    res.status(201).json({
      status: 'success',
      data: {
        loan: newLoan
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findOne({
      where: { id: req.params.id },
      include: [{
        model: Customer,
        where: { userId: req.user.id }
      }]
    });

    if (!loan) {
      return res.status(404).json({
        status: 'fail',
        message: 'No loan found with that ID'
      });
    }

    const { amount, dueDate, description } = req.body;

    const updatedLoan = await loan.update({
      amount: amount || loan.amount,
      dueDate: dueDate || loan.dueDate,
      description: description || loan.description
    });

    res.status(200).json({
      status: 'success',
      data: {
        loan: updatedLoan
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findOne({
      where: { id: req.params.id },
      include: [{
        model: Customer,
        where: { userId: req.user.id }
      }]
    });

    if (!loan) {
      return res.status(404).json({
        status: 'fail',
        message: 'No loan found with that ID'
      });
    }

    await loan.destroy();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

exports.getLoanSummary = async (req, res, next) => {
  try {
    const summary = await loanService.calculateLoanSummary(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        summary
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getOverdueLoans = async (req, res, next) => {
  try {
    const overdueLoans = await loanService.getOverdueLoans(req.user.id);
    
    res.status(200).json({
      status: 'success',
      results: overdueLoans.length,
      data: {
        overdueLoans
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.sendOverdueReminders = async (req, res, next) => {
  try {
    const overdueLoans = await loanService.getOverdueLoans(req.user.id);
    
    const results = [];
    for (const customer of overdueLoans) {
      for (const loan of customer.overdueLoans) {
        const result = await notificationService.sendPaymentReminder(
          {
            name: customer.customerName,
            phone: customer.customerPhone
          },
          {
            id: loan.id,
            remainingAmount: loan.remainingAmount,
            dueDate: loan.dueDate
          }
        );
        results.push({
          customerId: customer.customerId,
          loanId: loan.id,
          result
        });
      }
    }
    
    res.status(200).json({
      status: 'success',
      results: results.length,
      data: {
        reminders: results
      }
    });
  } catch (err) {
    next(err);
  }
};