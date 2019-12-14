const db = require("../database/models");
const extractExcelData = require('../helpers/extractExcelData');
const { unitStationSchema } = require('../helpers/excelSchemas');
const paginate = require('../helpers/paginate');

module.exports = {
    uploadUnitStations: async (req, res) => {

        try {
            
            if(!req.files)
                return res.status(400).json({ message: 'Upload a file to process'})
                
            const { uploadFile } = req.files;
            if(uploadFile.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                return res.status(400).json({
                    message: 'Only .xls or .xlsx files allowed'
                })
            
            extractExcelData(uploadFile.data, 
                            'unit_station_names', 
                            unitStationSchema,
                            db.UnitStations, 
                            async (report) => {
                    return res.status(report.status).json({
                        message: report.message,
                        data: uploadFile.name
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
            const page = req.query.page?req.query.page:1;
            const unitStations = await db.UnitStations.findAll({
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