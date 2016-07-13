jsforce-patient-bulk-op
==================

An npm module to [bulk insert/upsert to Salesforce via jsforce](https://jsforce.github.io/document/#bulk-api) with *patience*, adjustable timeout & poll frequency.

[![Build Status](https://travis-ci.org/mars/jsforce-patient-bulk-op.svg?branch=master)](https://travis-ci.org/mars/jsforce-patient-bulk-op)

Usage
-----

```bash
npm install jsforce-patient-bulk-op --save
```

Begin with an authenticated jsforce connection. [jsforce-connection](https://github.com/mars/jsforce-connection) creates one based on the `SALESFORCE_URL` env variable, or directly use [jsforce's Connection](https://jsforce.github.io/document/#connection).

Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for the completed response of a [Bulk API](https://jsforce.github.io/document/#bulk-api) operation.

### Example

```javascript
const jsforceConnection = require('jsforce-connection');
const patientBulkOp = require('jsforce-patient-bulk-op');

return jsforceConnection()
  .then( salesforceApi => {

    return patientBulkOp(
      salesforceApi,  // A jsforce Connection
      'Account',      // Name of a custom or standard sObject
      // Array of records to be inserted
      [
        { Name: 'Zushi Co.' },
        { Name: 'MUJI' }
      ],
      'insert',       // Operation to perform
      601000,         // Timeout ms, 10-min default, just beyond Salesforce's
      2000,           // Poll Interval ms, 2-second default
      console.log     // A function to call with messages to log, default is no-op
    )
    .then( result => console.log(result) );
  });
```