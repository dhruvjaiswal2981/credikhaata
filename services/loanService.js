const { Loan, Repayment, Customer } = require('../models');
const moment = require('moment');

exports.calculateLoanSummary = async (userId) => {
  // Get all customers for the user
  const customers = await Customer.findAll({
    where: { userId },
    include: [{
      model: Loan,
      include: [Repayment]
    }]
  });

  let totalLoaned = 0;
  let totalCollected = 0;
  let overdueAmount = 0;
  const repaymentTimes = [];

  customers.forEach(customer => {
    customer.Loans.forEach(loan => {
      totalLoaned += parseFloat(loan.amount);
      
      // Calculate total collected from repayments
      const collected = loan.Repayments.reduce((sum, repayment) => {
        return sum + parseFloat(repayment.amount);
      }, 0);
      
      totalCollected += collected;

      // Calculate overdue amount
      if (loan.status === 'overdue') {
        overdueAmount += parseFloat(loan.remainingAmount);
      }

      // Calculate repayment time for paid loans
      if (loan.status === 'paid' && loan.Repayments.length > 0) {
        const firstRepayment = loan.Repayments.reduce((earliest, repayment) => {
          return repayment.paymentDate < earliest.paymentDate ? repayment : earliest;
        }, loan.Repayments[0]);
        
        const repaymentTime = moment(firstRepayment.paymentDate).diff(moment(loan.createdAt), 'days');
        repaymentTimes.push(repaymentTime);
      }
    });
  });

  // Calculate average repayment time
  const averageRepaymentTime = repaymentTimes.length > 0 
    ? repaymentTimes.reduce((sum, time) => sum + time, 0) / repaymentTimes.length
    : 0;

  return {
    totalLoaned,
    totalCollected,
    overdueAmount,
    averageRepaymentTime: Math.round(averageRepaymentTime)
  };
};

exports.getOverdueLoans = async (userId) => {
  const customers = await Customer.findAll({
    where: { userId },
    include: [{
      model: Loan,
      where: { status: 'overdue' },
      include: [Repayment]
    }]
  });

  return customers.map(customer => {
    const overdueLoans = customer.Loans.map(loan => ({
      id: loan.id,
      amount: loan.amount,
      remainingAmount: loan.remainingAmount,
      dueDate: loan.dueDate,
      daysOverdue: moment().diff(moment(loan.dueDate), 'days'),
      repayments: loan.Repayments.map(repayment => ({
        amount: repayment.amount,
        paymentDate: repayment.paymentDate
      }))
    }));

    return {
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      overdueLoans
    };
  });
};