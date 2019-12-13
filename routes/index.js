const router = require('express').Router();
const UnitStationRouter = require('./unitStation');
const LoanStatusRouter = require('./loanStatus');
const LoansRouter = require('./loans');

router.use('/unitStations', UnitStationRouter);
router.use('/loanStatus', LoanStatusRouter);
router.use('/loans', LoansRouter);

module.exports = router;