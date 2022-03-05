const cmd = require('./useCommand')
const fs = require('fs')
const settings = require('./settings.json')
const getDiskInfo = require('./getDiskInfo')

const initial = async () => {
    // Check connection Yandex Disk
    const result = await getDiskInfo(settings.yandex.apiKey)

    if (result.error) {
        console.error(result)
        process.exit(1)
    }

    // Check folder
    var folder = result._embedded.items.find(item =>
        item.type === 'dir' && item.name === settings.yandex.savePath
    )

    if (!folder)
        throw new Error(`Not found folder "${settings.yandex.savePath}"`)

    console.log('[+] Successful authorization Yandex')

    // Check connection Mongo
    if (settings.backups.mongo.backup) {
        const mongoState = await cmd('mongodump --version')

        if (!mongoState)
            throw new Error('mongodump was not found')

        console.log('[+] Successful find mongodump')
    }

    // Check connection MySQL
    if (settings.backups.mysql.backup) {
        const mysqlState = await cmd('mysqldump --version')
        if (!mysqlState)
            throw new Error('mysqldump was not found')

        console.log('[+] Successful find mysqldump')
    }

    // Add tmp folder
    const dir = __dirname + '/tmp';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, 0744);
    }
}

exports.initial = initial