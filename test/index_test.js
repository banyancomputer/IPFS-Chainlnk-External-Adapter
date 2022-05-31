const assert = require('chai').assert
const createRequest = require('../index.js').createRequest

/* A file describing local tests of our EA's API. */

// Test: createRequest
describe('createRequest', () => {
  const jobID = '1'

  context('successful calls', () => {
    const requests = [
      // TODO: add more tests
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 200)
          assert.equal(data.jobRunID, jobID)
          assert.isNotEmpty(data.data)
          assert.isAbove(Number(data.result), 0)
          assert.isAbove(Number(data.data.result), 0)
          done()
        })
      })
    })
  })
  /*
  Error cases:
    - 400: Client error
    - 500: Server error
   */

  context('error calls', () => {
    const requests = [
      /* Server errors */
      { name: 'bad endpoint', testData: { id: jobID, data: { base: '', endpoint: 'bad' } }, statusCode: 500 },
      { name: 'bad cid', testData: { id: jobID, data: { base: '' } }, statusCode: 500 },

      /* Client error  */
      { name: 'empty body', testData: { }, statusCode: 400 }

      // TODO: add more tests
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, req.statusCode)
          assert.equal(data.jobRunID, jobID)
          assert.equal(data.status, 'errored')
          assert.isNotEmpty(data.error)
          done()
        })
      })
    })
  })
})
