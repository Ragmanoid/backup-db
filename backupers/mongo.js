const cmd = require('../useCommand')
const sendFile = require('../sendFile.js')

const mongo = async () => {
    const res = await cmd('mongodump --archive=./tmp/mongo.gzip --gzip')
    if (!res)
        console.error('Error backup mongo')
    else 
        sendFile('mongo.gzip')
}

module.exports = mongo