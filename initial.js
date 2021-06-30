const cmd = require('./useCommand')
const fs = require('fs')
const settings = require('./settings.json')
const { getLoggedAccount } = require('./login-handler')
const { getNodeByPath } = require('./util')

const initial = async () => {
    // Check connection Mega
    const { err, storage } = await getLoggedAccount({ 
        email: settings.mega.email, 
        password: settings.mega.password 
    })
    if (err) 
        throw new Error(err)

    const path = settings.mega.savePath.split('/').filter(e => e)
    const node = getNodeByPath(path, storage.root)

    if (!node) 
        throw new Error('ERROR: save folder (mega) not found')

    storage.close()
    
    console.log('[+] Successful authorization mega')
    
    // Check connection Mongo
    if (settings.backups.mongo.backup) {
        const mongoState = await cmd('mongodump --version')
        if (!mongoState)
            throw new Error('mongodump was not found')
        console.log('[+] Successful find mongodump')
    }
        
    // Check connection mysql
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