const io = require('@pm2/io')
const moment = require('moment')
const shaper = require('shaper')
const fs = require('fs-extra')

const settings = require('./settings.json')
const { getLoggedAccount } = require('./login-handler')
const { getNodeByPath, createFileProgressStream } = require('./util')


const spaceUsed = io.metric({
    name: 'Space used on mega (in kb)'
})
const spaceTotal = io.metric({
    name: 'Space total on mega (in kb)'
})

const sendFile = async file => {
    fs.stat('./tmp/' + file, async (error, stats) => {
        if (error && error.code === 'ENOENT') {
            console.error("ERROR: %s don't exists", file)
            process.exit(1)
        }

        if (error) {
            console.error(error)
            process.exit(1)
        }

        const { err, storage } = await getLoggedAccount({ 
            email: settings.mega.email, 
            password: settings.mega.password 
        })
        if (err) {
            console.error(err)
            process.exit(1)
        }
        
        const path = settings.mega.savePath.split('/').filter(e => e)
        const folder = getNodeByPath(path, storage.root)

        if (!folder) {
            console.error('ERROR: save folder not found')
            process.exit(1)
        }

        const name = `${moment().format('L')} ${moment().format('LTS')} ${file}`

        let uploadStream = folder.upload({ name })
        let readStream = fs.createReadStream('./tmp/' + file)

        const progressStream = createFileProgressStream(file, stats.size)
        readStream = readStream.pipe(progressStream)

        uploadStream.on('complete', () => {
            console.log('Upload complete', name)
            storage.close()
        })
        
        readStream.pipe(uploadStream)
        
        storage.getAccountInfo((e, d) => { 
            spaceUsed.set(d.spaceUsed / 1024)
            spaceTotal.set(d.spaceTotal / 1024)
        })
        
        storage.close()
    })
}

module.exports = sendFile