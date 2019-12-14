const router = require('express').Router();
const { uploadUnitStations, getUnitStations } = require('../controllers/UnitStationController');

router.post('/upload', uploadUnitStations);
router.get('/', getUnitStations);

module.exports = router;