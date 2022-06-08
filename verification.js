const fs = require('fs')
const { create } =  require('ipfs-http-client')

const file_cid  = "QmVdendwPSuYu2xxjk4kravfPJBy7e4QvQcQNwaTCAZcDC"; // ethereum whitepaper 

const checkFile = async (cid, client) => {

    const source = client.cat(cid)
    let contents = ''
    const decoder = new TextDecoder('utf-8')

    for await (const chunk of source) 
    {
        contents += decoder.decode(chunk, 
        {
            stream: true
        })
    }
    contents += decoder.decode()
    //console.log("text: ", contents)
    
    const hash_v3 = (await client.add(contents, onlyHash = true)).cid.toString()
    console.log("cid1_: ", hash_v3)
    console.log("cid2_: ", cid)
    if (hash_v3 == cid)
        console.log("FILE: SUCCESS")
    else
        console.log("FILE: FAILURE")
}

const checkBlock = async (cid, index, client) => {

    //const client = create('/ip4/127.0.0.1/tcp/5001')
    const decoder = new TextDecoder('utf-8')
    const links = await client.object.links(cid)
    const hashes = links.map((link) => link.Hash.toString())
    if (hashes[index])
    {
        block_cid = hashes[index]
        source = await client.cat(block_cid)
        experiment = await client.block.get(block_cid)
        console.log("Experiment: ", typeof(experiment))
        console.log("Working: ", typeof(source))
    }
    else
        throw new Error("No block of that index")

    let contents_1 = ''
    for await (const chunk of source) 
    {
        contents_1 += decoder.decode(chunk, 
        {
            stream: true
        })
    }
    contents_1 += decoder.decode()
    // console.log("text: ", contents_1)
    fs.writeFile('source.txt', contents_1, err => {
        if (err) {
        console.error(err)
        return
        }
        //file written successfully
    })
    /*
    let contents_2 = ''
    for await (const piece of experiment) 
    {
        contents_2 += decoder.decode(piece, 
        {
            stream: true
        })
    }
    contents_2 += decoder.decode()
    // console.log("text: ", contents_2)
    */
    
    const hash_cat = (await client.add(contents_1, onlyHash = true)).cid.toString()
    //const hash_get = (await client.add(contents_2, onlyHash = true)).cid.toString()
    console.log("cid1_: ", hash_cat)
    //console.log("cid2_: ", hash_get)
    console.log("cid3_: ", block_cid)
    if (hash_cat == block_cid)
        console.log("BLOCK: SUCCESS")
    else
        console.log("BLOCK: FAILURE")
}

const client = create('/ip4/127.0.0.1/tcp/5001')
const file_output = checkFile(file_cid, client)
const index = 2
const block_output = checkBlock(file_cid, index, client)

