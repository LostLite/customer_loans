const router = require('express').Router();
const { uploadLoans, getLoans, getSingleLoan} = require('../controllers/LoansController');

router.post('/upload', uploadLoans);
router.get('/', getLoans);
router.get('/:id', getSingleLoan);

module.exports = router;