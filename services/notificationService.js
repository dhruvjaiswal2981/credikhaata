const moment = require('moment');

// Mock function for SMS/WhatsApp notification
exports.sendPaymentReminder = async (customer, loan) => {
  // In a real implementation, this would integrate with an SMS/WhatsApp API
  const daysOverdue = moment().diff(moment(loan.dueDate), 'days');
  
  console.log(`Sending reminder to ${customer.name} (${customer.phone})`);
  console.log(`Loan ID: ${loan.id}, Amount Due: ${loan.remainingAmount}, Days Overdue: ${daysOverdue}`);
  
  return {
    success: true,
    message: 'Reminder sent successfully (simulated)'
  };
};