const router = require('express').Router();
const { uploadLoanStatus, getLoanStatusList, getLoanStatus } = require('../controllers/LoanStatusController');

router.post('/upload', uploadLoanStatus);
router.get('/:id', getLoanStatus);
router.get('/', getLoanStatusList);

module.exports = router;