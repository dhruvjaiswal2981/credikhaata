const express = require('express');
const repaymentController = require('../controllers/repaymentController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware);

router
  .route('/')
  .post(repaymentController.createRepayment);

router
  .route('/loan/:loanId')
  .get(repaymentController.getRepaymentsForLoan);

module.exports = router;