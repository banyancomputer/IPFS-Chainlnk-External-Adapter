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

  context('error calls', () => {
    const requests = [
      { name: 'empty body', testData: { id: jobID, data: {} } },
      { name: 'bad_cid', testData: { id: jobID, data: { base: '' } } }
      // TODO: add more tests
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 500)
          assert.equal(data.jobRunID, jobID)
          assert.equal(data.status, 'errored')
          assert.isNotEmpty(data.error)
          done()
        })
      })
    })
  })
})
