const db = require('../database/models/');
const extractExcelData = require('../helpers/extractExcelData');
const { loanSchema } = require('../helpers/excelSchemas');
const paginate = require('../helpers/paginate');

module.exports = {
    uploadLoans: async (req, res) => {
        try {
            
            if(!req.files)
                return res.status(400).json({ message: 'Upload a file to process'})
 
            const { stationFile } = req.files;
            if(stationFile.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                return res.status(400).json({
                    message: 'Only .xls or .xlsx files allowed'
                })

            extractExcelData(stationFile.data, 
                            'loans', 
                            loanSchema,
                            db.Loans, 
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

    getLoans: async (req, res) => {

        try {
            const {filters} = req.params;
            const page = req.params.page?req.params.page:1;
            const loansList = await db.Loans.findAll({
                attributes: ['id', 'loanDate', 'dueDate', 'loanCode', 'loanAmount', 'customerStation', 'customerId'],
                include: [
                        {model: db.LoanStatus, attributes: ['status']},
                        {model: db.UnitStations, attributes: ['stationName']},
                    ],
                where: {...filters},
                ...paginate({page})
            })

            return res.status(200).json({
                loansList
            })

        } catch (error) {
            return res.status(400).json({
                message: 'An error occurred while fetching all loans',
                error
            });
        }
    }
}