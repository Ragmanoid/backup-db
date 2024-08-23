const cmd = require('../useCommand')
const sendFile = require('../sendFile.js')

const postgres = async ({ settings }) => {
    const res = await cmd(`pg_dump -Z9 -U ${settings.username} -w -h 127.0.0.1 -f ./tmp/postgres.gz`)
    if (!res)
        console.error('Error backup postgres')
    else
        sendFile('postgres.gzip')
}

module.exports = postgres