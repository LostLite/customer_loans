const db = require("../database/models");
const extractExcelData = require('../helpers/extractExcelData');
const { unitStationSchema } = require('../helpers/excelSchemas');
const paginate = require('../helpers/paginate');

module.exports = {
    createStation: async (req, res) => {

        try {
            
            const {stationName, dailyTarget, monthlyTarget} = req.body;

            const station = await db.UnitStation.create({
                stationName, 
                dailyTarget, 
                monthlyTarget
            });

            return res.status(200).json({
                message: 'Unit Station created successfully',
                station
            });

        } catch (error) {
            return res.status(400).json({
                message: 'An error occurred while creating a station',
                error
            });
        }

    },

    uploadUnitStations: async (req, res) => {

        try {
            
            if(!req.files)
                return res.status(400).json({ message: 'Upload a file to process'})
                
            const { stationFile } = req.files;
            if(stationFile.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                return res.status(400).json({
                    message: 'Only .xls or .xlsx files allowed'
                })
            
            extractExcelData(stationFile.data, 
                            'unit_station_names', 
                            unitStationSchema,
                            db.UnitStations, 
                            async (report) => {
                    return res.status(report.status).json({
                        message: report.message,
                        data: stationFile.name
                    });
            });                
        
        } catch (error) {
            return res.status(400).json({
                message: 'An error occurred while uploading a file',
                error
            });
        }
    },

    getUnitStations: async  (req, res) => {

        try {
            const page = req.params.page?req.params.page:1;
            const unitStations = await db.UnitStation.findAll({
                attributes: ['id','stationName','dailyTarget','monthlyTarget'],
                order: [['id', 'ASC']],
                ...paginate({page})
            });

            return res.status(200).json({unitStations});
        } catch (error) {
            return res.status(400).json({
                message: 'An error occurred while getting the stations',
                error
            });
        }
    }
}