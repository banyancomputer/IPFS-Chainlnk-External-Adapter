const { Requester, Validator } = require('@chainlink/external-adapter')
const { create } = require('ipfs-http-client')

// Set the parameters for our adapter
const adapterParams = {
  // We must receive a CID with our request
  cid: ['cid'],
  // We (eventually) want to return a sequence of bytes
  // quote: ['quote', 'bytes'],
  // Optionally specify a path for our file
  // path: false,
  // Endpoint for our IPFS node. Not required as of now
  endpoint: false
}

// Check the status of a file based on it's CID and an ipfs client
const checkStatus = async (ipfsNode, cid) => {
  const fileStatus = await ipfsNode.files.stat(cid)
  return fileStatus.cid.toString() === cid
}

// Create a request for our endpoint
const createRequest = async (input, callback) => {
  // console.debug('[EA] createRequest(): ', input)

  // Validate the input
  const validator = new Validator(input, adapterParams)
  if (validator.error) {
    // console.debug('[EA] failed validation')
    return callback(validator.error.statusCode, validator.errored)
  }
  /* Required parameters */

  // The jobID specified by our calling node
  const jobRunID = validator.validated.id
  // The CID of the file we want to check
  const cid = validator.validated.data.cid
  // The index of the bytes we want to check
  // const bytes = validator.validated.data.quote.bytes

  /* Optional parameters */

  // The path of the file we want to check
  // const path = input.data.path || ''
  // The endpoint of the IPFS node we want to use
  const endpoint = input.data.endpoint || (process.env.IPFS_NODE_ENDPOINT || 'http://127.0.0.1:5001')
  // console.log('[EA] endpoint: ', endpoint)

  // console.debug('[EA] Making request to IPFS node')
  try {
    // Create a client to handle our requests to IPFS nodes
    const ipfsNode = create(endpoint)
    // Check the status of the file
    const status = await checkStatus(ipfsNode, cid)
    // If the file is found, return the status
    callback(200, Requester.success(jobRunID, { data: { result: status }, status: 200 }))
  } catch (error) {
    // console.debug('[EA] Encountered an error:', error)
    // If the file is not found, return the error
    callback(500, Requester.errored(jobRunID, error))
  }
}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
