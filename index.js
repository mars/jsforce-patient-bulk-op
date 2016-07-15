module.exports = function jsforcePatientBulkOp(
  salesforceApi,              // jsforce conenction
  objectName,                 // Salesforce object name
  objectRecords,              // Array of object records
  operation     = 'insert',   // Any Bulk API operation
  timeout       = 601000,     // Salesforce kills & requeues after 10-minutes
  pollInterval  = 2000,       // Ping pong
  logger        = () => {}    // A function to call with log messages
) {
  return new Promise((resolve, reject) => {
    try {
      if (objectRecords == null || objectRecords.length === 0) {
        return resolve([]);
      }

      const job = salesforceApi.bulk.createJob(objectName, operation);
      const batch = job.createBatch();

      let jobId;
      let batchId;

      batch.execute(objectRecords);
      batch.on('error', function(error) {
        reject(error);
      }); 
      batch.on('queue', function(batchInfo) {
        try {
          batchId = batchInfo.id;
          jobId = batchInfo.jobId;
          logger(`       Queued "${objectName}": batch ${batchId}, job ${jobId}`);
          batch.poll(pollInterval, timeout);
          batch.on('response', function(result) {
            logger(`       Completed "${objectName}"`);
            resolve(result);
          }); 

        } catch(error) {
          reject(error);
        }
      });

    } catch(error) {
      reject(error);
    }
  })
}