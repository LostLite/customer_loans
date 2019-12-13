const db = require('../database/models');
const extractExcelData = require('../helpers/extractExcelData');
const { loanStatusSchema } = require('../helpers/excelSchemas');
const paginate = require('../helpers/paginate');

module.exports = {

    uploadLoanStatus: async (req, res) => {
        try {
            
            if(!req.files)
                return res.status(400).json({ message: 'Upload a file to process'})
                
            const { stationFile } = req.files;
            if(stationFile.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                return res.status(400).json({
                    message: 'Only .xls or .xlsx files allowed'
                })
            
            extractExcelData(stationFile.data, 
                            'loan_status', 
                            loanStatusSchema,
                            db.LoanStatus, 
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

    getLoanStatusList: async (req, res) => {

        try {
            const page = req.params.page?req.params.page:1;
            const loanStatusList = await db.LoanStatus.findAll({
                attributes: ['id', 'status'],
                ...paginate({page})
            })

            return res.status(200).json({
                loanStatusList
            });

        } catch (error) {
            return res.status(400).json({
                message: 'An error occurred when getting the list of loan statuses',
                error
            })
        }
    },

    getLoanStatus: async (req, res) => {
        try {
            const loanStatus= await db.LoanStatus.findByPk(req.params.id, {
                attributes: ['id', 'status']
            });
            
            return res.status(200).json({
                loanStatus
            });

        } catch (error) {
            return res.status(400).json({
                message: 'An error occurred when getting the list of loan statuses',
                error
            })
        }
        
    }
}

