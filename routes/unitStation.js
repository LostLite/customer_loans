const router = require('express').Router();
const { uploadUnitStations } = require('../controllers/UnitStationController');

router.post('/upload', uploadUnitStations);

module.exports = router;