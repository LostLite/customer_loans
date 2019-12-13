const router = require('express').Router();
const { uploadLoans, getLoans} = require('../controllers/LoansController');

router.post('/upload', uploadLoans);
router.get('/', getLoans);

module.exports = router;