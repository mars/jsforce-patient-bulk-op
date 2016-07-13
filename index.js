module.exports = function jsforcePatientBulkOp(
  salesforceApi,
  objectName,
  objectRecords,
  operation     = 'insert',
  timeout       = 601000,
  pollInterval  = 2000,
  logger        = () => {}
) {
  return new Promise((resolve, reject) => {
    try {
      const job = salesforceApi.bulk.createJob(objectName, operation);
      const batch = job.createBatch();

      let jobId;
      let batchId;

      batch.execute(objectRecords);
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