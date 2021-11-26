# Chainlink IPFS External Adapter Template

A simple IPFS client Cahinlink External Adapter.
The adapter supports both reading and writing over the IPFS protocol by calling an IPFS node.

## Configuration

The adapter takes the following environment variables:

| Required? |        Name        |         Description          | Options | Defaults to |
| :-------: | :----------------: | :--------------------------: | :-----: | :---------: |
|         | `IPFS_NODE_ENDPOINT` | your IPFS node endpoint |         |      `http://127.0.0.1:5001`       |


## Install Locally

Install dependencies:

```bash
yarn
```

## Running

```bash
yarn start
```

### Input Params
There is 2 mode you can use which defined by `action` parameter

| Required? |            Name            |               Description                |       Options       | Defaults to |
| :-------: | :------------------------: | :--------------------------------------: | :-----------------: | :---------: |
|    ✅     | `action`  |   Add an entry to IPFS     | `ADD` or `CAT` |             |
|    Required for `ADD`     | `content`  |   Content of entry you wish to add     |  |             |
|    Optional for `ADD`     | `path`  |   Path of the entry     |  |             |
|    Required for `CAT`     | `cid` | CID of the entry (returns after adding an entry) |  |             |

### Sample Input

```json
{
    "id": "278c97ffadb54a5bbb93cfec5f7b5503",
    "data": {
        "action": "ADD",
        "path": "test.txt",
        "content": "Hello :)"
    }
}
```

### Sample Output

```json
{
    "jobRunID": "278c97ffadb54a5bbb93cfec5f7b5503",
    "data": {
        "result": "QmZDX7M65CWi8dcWtk8DKwvzaLRf4Fvw76RMPvUqWwNRDv"
    },
    "result": "QmZDX7M65CWi8dcWtk8DKwvzaLRf4Fvw76RMPvUqWwNRDv",
    "statusCode": 200
}
```