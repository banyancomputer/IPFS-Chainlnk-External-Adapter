const fs = require('fs')
const { create } =  require('ipfs-http-client')
var getRandomValues = require('get-random-values');
const all = require('it-all')
//const IPFS = require('ipfs-core');
//const CID = require('cids');
//const json = require('multiformats/codecs/json');




/**
 * Install: 
 * npm install get-random-values --save
 * 
 * TO DO:
 * Make sure this random library is cryptographically secure
 * 
 */



/**
 * checkCid takes a cid of a directory or file and verifies the hashes
 * of every file in every directory and subdirectory  
 *
 * @param {number} cid - file cid
 * @param {number} client - ipfs-http-client
 */
const checkCid = async (cid, client) => {

    let object = await all(client.ls(cid));
    const file_length = object.length
    console.log("directory: ", object)
    if (file_length > 1 && (object[0].path != cid)) // Janky check whether it is a directory with files in it. 
    {
        for(i = 0; i < file_length; i++)
        {
            const type =  object[i].type
            if (type == "dir")
            {
                console.log("SUB DIR")
                checkCid(object[i].cid, client)
            }
            else
            {
                checkBlock(object[i].cid, client);
            }
        }
    }
    else
    {
        console.log("NOT A DIR");
        await checkBlock(cid, client);
    }
}

/**
 * checkFile takes the cid of a file and the initiated ipfs-http-client node and 
 * checks whether the hash of the file is equal to the cid of the file. 
 *
 * @param {number} cid - file cid
 * @param {number} client - ipfs-http-client
 */
const checkFile = async (cid, client) => {

    console.log("ITER:", cid);
    const source = client.cat(cid)   
    const hash_v3 = (await client.add(source, {onlyHash: true}, {pin: false})).cid.toString()
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
 * @param {any} client - ipfs-http-client
 * @param {number} index - the index of the block to verify
 */
const checkBlock = async (cid, client) => {

    const stat = await client.object.stat(cid)
    console.log("Num Links: ", stat.NumLinks)
    if (stat.NumLinks == 0 )
    {
        console.log("HERE")
        checkFile(cid, client)
    }
    else
    {
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
        checkFile(block_cid, client)
    }
    else
        throw new Error("No block of that index")

    }
}

const init = async() => {

    const client = create('/ip4/127.0.0.1/tcp/5001')
    //const client = await IPFS.create();
    const file_cid_dir = "QmXnz4zcfSW9SfSfZHj6qCGvkUzHZjPZ7Y8D4woVehFpBV";
    const eth_cid = "Qmd63gzHfXCsJepsdTLd4cqigFa7SuCAeH6smsVoHovdbE"
    const btc_cid = "QmRA3NWM82ZGynMbYzAgYTSXCVM14Wx1RZ8fKP42G6gjgj"
    const bad_cid = "Qmad1E95Qb4U329aHdGpxUuPRErYuFKGYpzNo6ZL8FPxwz"
    const default_cid = "QmSnuWmxptJZdLJpKRarxBMS2Ju2oANVrgbr2xWbie9b2D"

    const dir_cid = "QmP1GeMrSECApwGnMoNgfb2MD3wvwLXzYRKx5P51SWwZyd"
    //checkCid(eth_cid, client)
    checkCid(btc_cid, client)
    //checkFile(eth_cid, client)
    //checkFile(btc_cid, client)

    //const source = client.cat(default_cid)   
    //checkBlock(eth_cid, client)
    //checkBlock(btc_cid, client)
    //checkBlock(dir_cid, client)
    //checkBlock(default_cid, client)
    //checkBlock(btc_cid, client)
    checkCid(default_cid, client)
}
/**
* Testing functions. Eth_cid corresponds to ethereum whitepaper. file_cid_dir corresponds
* to a directory of files on a local machine being pinned. 
*/

init()

//checkBlock(eth_cid. client)
//checkBlock(btc_cid, client)

/** 
 * I found a janky solution to the problem of determining if the file is a directory. 
 * Background is files.stat is not working as a system call for the http client, and I 
 * couldn't find an easy way to see if a cid is a directory or file. ls prints out links 
 * of subblocks within a single file counterintuitively, but I realized that those subblocks
 * have paths equal to the cid of the file, whereas when ls happens normally on a directory, the 
 * paths of the files within the directory are not equal to the cid of the directory. Kinda 
 * janky but works for now. 
 * 
 * One remaining issue is synchronicity. When I put an await on line 36, it wouldn't iterate 
 * through the rest of the files in the initial directory. When I took it away, it did, but the files
 * are being verified not really in order. Not a big deal but if I understood asynchronous calls better 
 * sure there would be an easy solution.
 */
