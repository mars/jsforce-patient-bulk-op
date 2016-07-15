const test = require('ava')
const nock = require('nock')
const patientBulkOp = require('.')
const jsforceConnection = require('jsforce-connection')

test('Eventually returns the Bulk API response', t => {
  const mockRecords = [
    { Name: 'Zushi Co.' },
    { Name: 'MUJI' }
  ]
  const expectedResponse = [
    {
      "id": "0013600000SWmOTAA1",
      "success": true,
      "errors": []
    },
    {
      "id": "0013600000SWmOUAA1",
      "success": true,
      "errors": []
    }
  ]

  process.env.SALESFORCE_URL = 'force://MOCK_CLIENT_ID:MOCK_SECRET:MOCK_REFRESH_TOKEN@naXX.salesforce.com'
  mockSuccessfulBulkOp()

  return jsforceConnection('37.0')
    .then( salesforceApi => {
      return patientBulkOp(salesforceApi, 'Account', mockRecords, 'insert')
    })
    .then( response => {
      t.deepEqual(response, expectedResponse)
    })
})

test('Eventually returns an empty response when no records are provided', t => {
  const mockRecords = []
  const expectedResponse = []

  return patientBulkOp({}, 'Account', mockRecords, 'insert')
    .then( response => {
      t.deepEqual(response, expectedResponse)
    })
})



function mockSuccessfulBulkOp() {

  nock('https://naXX.salesforce.com:443', {"encodedQueryParams":true})
    .get('/services/data/v37.0/sobjects/User/describe')
    .reply(401, [{"message":"Session expired or invalid","errorCode":"INVALID_SESSION_ID"}], { date: 'Wed, 13 Jul 2016 22:23:50 GMT',
    'set-cookie': [ 'BrowserId=DfmbxjkOTEauoxpO_T1GDQ;Path=/;Domain=.salesforce.com;Expires=Sun, 11-Sep-2016 22:23:50 GMT' ],
    expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
    'www-authenticate': 'Token',
    'content-type': 'application/json;charset=UTF-8',
    'transfer-encoding': 'chunked',
    connection: 'close' });

  nock('https://login.salesforce.com:443', {"encodedQueryParams":true})
    .post('/services/oauth2/token', "grant_type=refresh_token&refresh_token=MOCK_REFRESH_TOKEN&client_id=MOCK_CLIENT_ID&client_secret=MOCK_SECRET")
    .reply(200, {"access_token":"00D36000001HDi3!ARwAQLy7uZdTdv5Iw6tQFhGA5NEKBtas1FdXn1USaeN7HAzLPcNwZ86DH8ddqP9R_b7i0KBu27aAT9ACl5Y0M.kV.S6IEIIl","signature":"rMCD2/FFeFXu4i3lRP55rDh5Zs8dqh+rA2BrYdpVNp0=","scope":"refresh_token full","instance_url":"https://naXX.salesforce.com","id":"https://login.salesforce.com/id/00D36000001HDi3EAG/00536000002PmoeAAC","token_type":"Bearer","issued_at":"1468448630767"}, { date: 'Wed, 13 Jul 2016 22:23:50 GMT',
    'strict-transport-security': 'max-age=10886400; includeSubDomains; preload',
    'content-security-policy-report-only': 'default-src https:; script-src https: \'unsafe-inline\' \'unsafe-eval\'; style-src https: \'unsafe-inline\'; img-src https: data:; font-src https: data:; report-uri /_/ContentDomainCSPNoAuth?type=login, default-src https:; script-src https: \'unsafe-inline\' \'unsafe-eval\'; style-src https: \'unsafe-inline\'; img-src https: data:; font-src https: data:; report-uri /_/ContentDomainCSPNoAuth?type=login',
    'set-cookie': 
     [ 'BrowserId=zkGoelULQemkVjStyqP4HA;Path=/;Domain=.salesforce.com;Expires=Sun, 11-Sep-2016 22:23:50 GMT',
       'BrowserId=LoelxhPARuemE-TX_-aIzw;Path=/;Domain=.salesforce.com;Expires=Sun, 11-Sep-2016 22:23:50 GMT' ],
    expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
    pragma: 'no-cache',
    'cache-control': 'no-cache, no-store',
    'content-type': 'application/json;charset=UTF-8',
    'transfer-encoding': 'chunked',
    connection: 'close' });

  nock('https://naXX.salesforce.com:443', {"encodedQueryParams":true})
    .get('/services/data/v37.0/sobjects/User/describe')
    .reply(200, {}, { date: 'Wed, 13 Jul 2016 22:23:51 GMT',
    'set-cookie': [ 'BrowserId=VVr6LwqQShu6erDvbVsiQg;Path=/;Domain=.salesforce.com;Expires=Sun, 11-Sep-2016 22:23:51 GMT' ],
    expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
    'sforce-limit-info': 'api-usage=75/15000',
    'org.eclipse.jetty.server.include.etag': '"40c0cfe6"',
    'last-modified': 'Wed, 29 Jun 2016 20:32:01 GMT',
    'content-type': 'application/json;charset=UTF-8',
    etag: '"40c0cfe6"',
    'transfer-encoding': 'chunked',
    connection: 'close' });

  nock('https://naXX.salesforce.com:443', {"encodedQueryParams":true})
    .post('/services/async/37.0/job', "<?xml version=\"1.0\" encoding=\"UTF-8\"?><jobInfo  xmlns=\"http://www.force.com/2009/06/asyncapi/dataload\"><operation>insert</operation><object>Account</object><contentType>CSV</contentType></jobInfo>")
    .reply(201, "<?xml version=\"1.0\" encoding=\"UTF-8\"?><jobInfo\n   xmlns=\"http://www.force.com/2009/06/asyncapi/dataload\">\n <id>75036000003uE2FAAU</id>\n <operation>insert</operation>\n <object>Account</object>\n <createdById>00536000002PmoeAAC</createdById>\n <createdDate>2016-07-13T22:23:53.000Z</createdDate>\n <systemModstamp>2016-07-13T22:23:53.000Z</systemModstamp>\n <state>Open</state>\n <concurrencyMode>Parallel</concurrencyMode>\n <contentType>CSV</contentType>\n <numberBatchesQueued>0</numberBatchesQueued>\n <numberBatchesInProgress>0</numberBatchesInProgress>\n <numberBatchesCompleted>0</numberBatchesCompleted>\n <numberBatchesFailed>0</numberBatchesFailed>\n <numberBatchesTotal>0</numberBatchesTotal>\n <numberRecordsProcessed>0</numberRecordsProcessed>\n <numberRetries>0</numberRetries>\n <apiVersion>37.0</apiVersion>\n <numberRecordsFailed>0</numberRecordsFailed>\n <totalProcessingTime>0</totalProcessingTime>\n <apiActiveProcessingTime>0</apiActiveProcessingTime>\n <apexProcessingTime>0</apexProcessingTime>\n</jobInfo>", { date: 'Wed, 13 Jul 2016 22:23:53 GMT',
    'set-cookie': [ 'BrowserId=zBSL4PMVTuCGI28Zta0yQw;Path=/;Domain=.salesforce.com;Expires=Sun, 11-Sep-2016 22:23:53 GMT' ],
    expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
    location: '/services/async/37.0/job/75036000003uE2FAAU',
    'content-type': 'application/xml',
    'transfer-encoding': 'chunked',
    connection: 'close' });

  nock('https://naXX.salesforce.com:443', {"encodedQueryParams":true})
    .post('/services/async/37.0/job/75036000003uE2FAAU/batch', "Name\nZushi Co.\nMUJI\n")
    .reply(201, "<?xml version=\"1.0\" encoding=\"UTF-8\"?><batchInfo\n   xmlns=\"http://www.force.com/2009/06/asyncapi/dataload\">\n <id>751360000039aC8AAI</id>\n <jobId>75036000003uE2FAAU</jobId>\n <state>Queued</state>\n <createdDate>2016-07-13T22:23:54.000Z</createdDate>\n <systemModstamp>2016-07-13T22:23:54.000Z</systemModstamp>\n <numberRecordsProcessed>0</numberRecordsProcessed>\n <numberRecordsFailed>0</numberRecordsFailed>\n <totalProcessingTime>0</totalProcessingTime>\n <apiActiveProcessingTime>0</apiActiveProcessingTime>\n <apexProcessingTime>0</apexProcessingTime>\n</batchInfo>", { date: 'Wed, 13 Jul 2016 22:23:54 GMT',
    'set-cookie': [ 'BrowserId=g1Ez0DPcRtG-X88Sv6ixPw;Path=/;Domain=.salesforce.com;Expires=Sun, 11-Sep-2016 22:23:54 GMT' ],
    expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
    location: '/services/async/37.0/job/75036000003uE2FAAU/batch/751360000039aC8AAI',
    'content-type': 'application/xml',
    'transfer-encoding': 'chunked',
    connection: 'close' });

  nock('https://naXX.salesforce.com:443', {"encodedQueryParams":true})
    .get('/services/async/37.0/job/75036000003uE2FAAU/batch/751360000039aC8AAI')
    .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\"?><batchInfo\n   xmlns=\"http://www.force.com/2009/06/asyncapi/dataload\">\n <id>751360000039aC8AAI</id>\n <jobId>75036000003uE2FAAU</jobId>\n <state>InProgress</state>\n <createdDate>2016-07-13T22:23:54.000Z</createdDate>\n <systemModstamp>2016-07-13T22:23:55.000Z</systemModstamp>\n <numberRecordsProcessed>0</numberRecordsProcessed>\n <numberRecordsFailed>0</numberRecordsFailed>\n <totalProcessingTime>0</totalProcessingTime>\n <apiActiveProcessingTime>0</apiActiveProcessingTime>\n <apexProcessingTime>0</apexProcessingTime>\n</batchInfo>", { date: 'Wed, 13 Jul 2016 22:23:55 GMT',
    'set-cookie': [ 'BrowserId=PxVlACKoT92jsZ8sI3UpWw;Path=/;Domain=.salesforce.com;Expires=Sun, 11-Sep-2016 22:23:55 GMT' ],
    expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
    'content-type': 'application/xml',
    'transfer-encoding': 'chunked',
    connection: 'close' });

  nock('https://naXX.salesforce.com:443', {"encodedQueryParams":true})
    .get('/services/async/37.0/job/75036000003uE2FAAU/batch/751360000039aC8AAI')
    .reply(200, "<?xml version=\"1.0\" encoding=\"UTF-8\"?><batchInfo\n   xmlns=\"http://www.force.com/2009/06/asyncapi/dataload\">\n <id>751360000039aC8AAI</id>\n <jobId>75036000003uE2FAAU</jobId>\n <state>Completed</state>\n <createdDate>2016-07-13T22:23:54.000Z</createdDate>\n <systemModstamp>2016-07-13T22:23:55.000Z</systemModstamp>\n <numberRecordsProcessed>2</numberRecordsProcessed>\n <numberRecordsFailed>0</numberRecordsFailed>\n <totalProcessingTime>844</totalProcessingTime>\n <apiActiveProcessingTime>755</apiActiveProcessingTime>\n <apexProcessingTime>0</apexProcessingTime>\n</batchInfo>", { date: 'Wed, 13 Jul 2016 22:23:57 GMT',
    'set-cookie': [ 'BrowserId=ZN2OWSC8Q7K1FmNwIlnJCA;Path=/;Domain=.salesforce.com;Expires=Sun, 11-Sep-2016 22:23:57 GMT' ],
    expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
    'content-type': 'application/xml',
    'transfer-encoding': 'chunked',
    connection: 'close' });

  nock('https://naXX.salesforce.com:443', {"encodedQueryParams":true})
    .get('/services/async/37.0/job/75036000003uE2FAAU/batch/751360000039aC8AAI/result')
    .reply(200, "\"Id\",\"Success\",\"Created\",\"Error\"\n\"0013600000SWmOTAA1\",\"true\",\"true\",\"\"\n\"0013600000SWmOUAA1\",\"true\",\"true\",\"\"\n", { date: 'Wed, 13 Jul 2016 22:23:57 GMT',
    'set-cookie': [ 'BrowserId=qNSnyaMsQ_qPIg9dpD72-w;Path=/;Domain=.salesforce.com;Expires=Sun, 11-Sep-2016 22:23:57 GMT' ],
    expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
    'content-type': 'text/csv',
    'transfer-encoding': 'chunked',
    connection: 'close' });

}
