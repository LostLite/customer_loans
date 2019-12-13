const xlsx = require('xlsx');
const queue = require('async/queue');

//Chunk size for splitting array
let chunkSize=1000;

const recursiveBulkAdd = async (data, model) =>{
    try {
        const arrayChunk = data.splice(0, Math.min(chunkSize, data.length));
        if(arrayChunk.length > 0){
            model.bulkCreate(arrayChunk).done((err, result) => {
                if (data.length > 0){
                    recursiveBulkAdd(data, model)
                }else{
                    if(err) console.error(err);
                    if(result) console.log('Result returned');
                    return
                }
            })
        }else{
            console.log('Data loading complete.')
            return
        }
    } catch (error) {
        console.error(error)
        return;
    }  
}

const extractExcelData = async (buffer, sheet, schema, model, callBack) => {
    
    //reading the data into the workbook slows down the application
    const workbook = xlsx.read(buffer, {type: 'array', cellDates: true});
    
    const worksheet = workbook.Sheets[`${sheet}`];
    if(!worksheet){
        callBack({status:400, message: 'Null worksheet, null range'});
    }else{
        //is the workbook proper?
        let ref = worksheet['!ref'];
        if(!ref && ref.indexOf(':') === -1){
            callBack({status: 400, message: 'Malformed workbook. no !ref property'});
        }else{
            //Convert worksheet to json
            const sheet = xlsx.utils.sheet_to_json(worksheet);
            const data = sheet.map(record => {
                return schema(record);
            });
            
            try {
                //set up a queue to handle the data loading process. Run two worker processes concurrently
                const q = queue((task,callback)=>{
                    
                    recursiveBulkAdd(task.data,task.model)
                },5);

                //push values into the queue
                q.push([{data,model}], (err)=>{
                    if (err) {
                        console.log(err)
                    }
                })
                
                //execute the queue. Log notice once queue has been drained
                q.drain(() => {
                    console.info('All items have been processed')
                });

                callBack({status: 200, 
                    message: 'File received. It may take some time to finish uploading all the data. Check periodically.'});
            } catch (error) {
                console.warn('Queue error', error)
                callBack({status: 400, message: 'Queue error'});
            }
        }
    }
}

module.exports = extractExcelData;