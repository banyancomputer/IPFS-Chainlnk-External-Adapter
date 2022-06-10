const fs = require('fs')
const { create } =  require('ipfs-http-client')
var getRandomValues = require('get-random-values');

/**
 * Install: 
 * npm install get-random-values --save
 * 
 * TO DO:
 * Make sure this random library is cryptographically secure
 */

/**
 * checkFile takes the cid of a file and the initiated ipfs-http-client node and 
 * checks whether the hash of the file is equal to the cid of the file. 
 *
 * @param {number} cid - file cid
 * @param {number} client - ipfs-http-client
 */
const checkFile = async (cid, client) => {

    const source = client.cat(cid)   
    const hash_v3 = (await client.add(source, onlyHash = true)).cid.toString()
    console.log("cid1_: ", hash_v3)
    console.log("cid2_: ", cid)
    if (hash_v3 == cid)
        console.log("FILE: SUCCESS")
    else
        console.log("FILE: FAILURE")
}

/**
 * checkBlock takes the cid of a file and the initiated ipfs-http-client node and checks whether 
 * the hash of a random block is equal to the cid of that block. Throws an error if that block does not exist 
 * 
 * @param {number} cid - file cid
 * @param {number} client - ipfs-http-client
 * @param {number} index - the index of the block to verify
 */
const checkBlock = async (cid, client) => {

    const links = await client.object.links(cid)
    const hashes = links.map((link) => link.Hash.toString())
    var array = new Uint8Array(1);
    getRandomValues(array);
    index = array[0] % hashes.length
    console.log("Your range:", hashes.length);
    console.log("Your lucky numbers:", index);
    if (hashes[index])
    {
        block_cid = hashes[index]
        source = await client.cat(block_cid)
    }
    else
        throw new Error("No block of that index")

    const hash_cat = (await client.add(source, onlyHash = true)).cid.toString()
    console.log("cid1_: ", hash_cat)
    console.log("cid3_: ", block_cid)
    if (hash_cat == block_cid)
        console.log("BLOCK: SUCCESS")
    else
        console.log("BLOCK: FAILURE")
}

/**
* Testing functions. File_cid corresponds to ethereum whitepaper. Currently using a non-random index.
*/

const file_cid  = "Qmd63gzHfXCsJepsdTLd4cqigFa7SuCAeH6smsVoHovdbE";
const client = create('/ip4/127.0.0.1/tcp/5001')
const file_output = checkFile(file_cid, client)
const block_output = checkBlock(file_cid, client)

