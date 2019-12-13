module.exports = {
    unitStationSchema: (record) =>{
        return {
            id: record.id,
            stationName: record['unit/ station name'],
            dailyTarget:record[' daily_target '],
            monthlyTarget: record[' monthly_target ']
        }
    },

    loanStatusSchema: (record) => {
        return {
            id: record.id,
            status: record.loan_status
        }
    },

    loanSchema: (record) => {
        return {
            loanDate: record.loan_date,
            dueDate: record.due_date,
            loanCode: record.loan_code,
            loanAmount: record.loan_amount,
            customerStation: record.customer_station,
            customerId: record.customer_id,
            loanStatus: record.loan_status
        }
    }
}