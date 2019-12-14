const sequelize = require('sequelize');
const Op = sequelize.Op;
const db = require('../database/models/');
const extractExcelData = require('../helpers/extractExcelData');
const { loanSchema } = require('../helpers/excelSchemas');
const paginate = require('../helpers/paginate');

module.exports = {
    uploadLoans: async (req, res) => {
        try {
            
            if(!req.files)
                return res.status(400).json({ message: 'Upload a file to process'})
 
            const { uploadFile } = req.files;
            if(uploadFile.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                return res.status(400).json({
                    message: 'Only .xls or .xlsx files allowed'
                })

            extractExcelData(uploadFile.data, 
                            'loans', 
                            loanSchema,
                            db.Loans, 
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

    getLoans: async (req, res) => {

        try {
            const {from, to} = req.query;
            const filters = {}
            if(typeof from != 'undefined' & typeof to !== 'undefined'){
                filters.loanDate= {[Op.between]:[from, to]}
            }
            
            const page = req.query.page?req.query.page:1;
            const loansList = await db.Loans.findAll({
                attributes: ['id', 
                    [sequelize.fn('date_format', sequelize.col('loanDate'), '%Y-%M-%d'), 'loanDate'], 
                    [sequelize.fn('date_format', sequelize.col('dueDate'), '%Y-%M-%d'), 'dueDate'], 
                    'loanCode', 'loanAmount', 'customerStation', 'customerId'],
                include: [
                        {model: db.LoanStatus, attributes: ['status']},
                        {model: db.UnitStations, attributes: ['stationName']},
                    ],
                where: {...filters},
                order: [['loanDate', 'ASC']],
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
    },

    getSingleLoan: async (req, res) =>{

        const {id} = req.params;
        const loan = await db.Loans.findByPk(id, {
            attributes: ['id', 'loanDate', 'dueDate', 'loanCode', 'loanAmount', 'customerStation', 'customerId'],
            include: [
                    {model: db.LoanStatus, attributes: ['status']},
                    {model: db.UnitStations, attributes: ['stationName']},
                ]
        });

        return res.status(200).json({loan})
    }
}