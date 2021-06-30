const cmd = require('../useCommand')
const sendFile = require('../sendFile.js')

const mysql = async () => {
    const res = await cmd('mysqldump --all-databases | gzip > ./tmp/mysql.gz')
    if (!res)
        console.error('Error backup mysql')
    else 
        sendFile('mysql.gzip')
}

module.exports = mysql