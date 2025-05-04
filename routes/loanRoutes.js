const express = require('express');
const loanController = require('../controllers/loanController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();


router.use(authMiddleware);


router.get('/summary', loanController.getLoanSummary);
router.get('/overdue', loanController.getOverdueLoans);
router.post('/overdue/send-reminders', loanController.sendOverdueReminders);


router
  .route('/')
  .get(loanController.getAllLoans)
  .post(loanController.createLoan);

router
  .route('/:id')
  .get(loanController.getLoan)
  .patch(loanController.updateLoan)
  .delete(loanController.deleteLoan);

module.exports = router;
