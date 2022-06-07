const Ctl = require("ipfsd-ctl")

async function run () {
    const ipfsd = await Ctl.createController({
        ipfsHttpModule,
        ipfsBin: goIpfsModule.path()
    })
    const id = await ipfsd.api.id()
    console.log(id)
}

run()