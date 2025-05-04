const { Repayment, Loan, Customer } = require('../models');
const moment = require('moment');

exports.createRepayment = async (req, res, next) => {
  try {
    const { loanId, amount, notes } = req.body;

    // Check if loan belongs to the user
    const loan = await Loan.findOne({
      where: { id: loanId },
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

    // Create repayment
    const repayment = await Repayment.create({
      loanId,
      amount,
      notes
    });

    // Update loan remaining amount
    const newRemainingAmount = parseFloat(loan.remainingAmount) - parseFloat(amount);
    await loan.update({
      remainingAmount: newRemainingAmount > 0 ? newRemainingAmount : 0
    });

    res.status(201).json({
      status: 'success',
      data: {
        repayment,
        remainingAmount: newRemainingAmount > 0 ? newRemainingAmount : 0
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getRepaymentsForLoan = async (req, res, next) => {
  try {
    const repayments = await Repayment.findAll({
      where: { loanId: req.params.loanId },
      include: [{
        model: Loan,
        include: [{
          model: Customer,
          where: { userId: req.user.id }
        }]
      }],
      order: [['paymentDate', 'DESC']]
    });

    if (!repayments || repayments.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No repayments found for this loan or loan does not belong to you'
      });
    }

    res.status(200).json({
      status: 'success',
      results: repayments.length,
      data: {
        repayments
      }
    });
  } catch (err) {
    next(err);
  }
};