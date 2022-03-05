const moment = require('moment')
const fs = require('fs')
const axios = require('axios')

const settings = require('./settings.json')
const getLinkForUpload = require('./getLinkForUpload')

const maxSize = 10 * 1024 * 1024 * 1024

const sendFile = async fileName => {
    fs.stat('./tmp/' + fileName, async (error, _) => {
        if (error && error.code === 'ENOENT') {
            console.error("ERROR: %s don't exists", fileName)
            process.exit(1)
        }

        if (error) {
            console.error(error)
            process.exit(1)
        }

        let name = `${moment().format()} ${fileName}`
        name = name.replace(/:/g, '-')
        name = name.replace(/,/g, '')
        name = name.replace(/ /g, '_')

        const result = await getLinkForUpload({
            apiKey: settings.yandex.apiKey,
            path: `/${settings.yandex.savePath}/${name}`
        })

        if (result.error) {
            console.error(result)
            process.exit(1)
        }


        console.log(`[!] Start upload ${fileName}`)
        const resp = await axios.put(
            result.href,
            fs.createReadStream(`./tmp/${fileName}`),
            {
                maxContentLength: maxSize,
                maxBodyLength: maxSize
            }
        )

        if (resp.status === 201) {
            console.log(`[!] Start complete ${fileName}`)
        } else {
            console.error(resp)
        }
    })
}

module.exports = sendFile