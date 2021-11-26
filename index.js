const { Requester, Validator } = require('@chainlink/external-adapter')
const { create } = require('ipfs-http-client')

const ipfsNode = create(process.env.IPFS_NODE_ENDPOINT || "http://127.0.0.1:5001")

const uploafFile = async (path, content) => {
  const file = { path, content }
  const fileAdded = await ipfsNode.add(file)

  return fileAdded.cid.toString()
}

const readFile = async (cid) => {
  const chunks = [];
  for await (const chunk of ipfsNode.cat(cid)) {
    chunks.push(chunk);
  }
  return chunks.toString()
}

const createRequest = async (input, callback) => {
  try {
    // Todo: add ChainLink Validator here
    const jobRunID = input.id
    const path = input.data.path
    const content = input.data.content
    const cid = input.data.cid
    const action = input.data.action

    if (action && action.toUpperCase() === 'ADD') {
      if (!content) {
        callback(500, Requester.errored(jobRunID, "missing 'content' param"))
      }
      const hash = await uploafFile(path, content)
      callback(200, Requester.success(jobRunID, { data: { result: hash }, status: 200 }))
    } else if (action && action.toUpperCase() === 'CAT') {
      if (!cid) {
        callback(500, Requester.errored(jobRunID, "missing 'cid' param"))
      }
      const content = await readFile(cid)
      callback(200, Requester.success(jobRunID, { data: { result: content }, status: 200 }))
    } else {
      callback(500, Requester.errored(jobRunID, "missing or incorrect 'action' param"))
    }
    
  } catch (error) {
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
