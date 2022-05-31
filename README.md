# Chainlink IPFS External Adapter Template

A simple proof of concept adapter that connects to an IPFS node, and checks the status of a file.

## Configuration

The adapter takes the following environment variables:

| Required? |        Name        |         Description          | Options | Defaults to |
|:---------:| :----------------: | :--------------------------: | :-----: | :---------: |
|    No     | `IPFS_NODE_ENDPOINT` | your IPFS node endpoint |         |      `http://127.0.0.1:5001`       |


## Install Locally

Install dependencies:

```bash
npm install
```

## Running

```bash
npm start
```

