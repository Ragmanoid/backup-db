const { initial } = require('./initial')
const settings = require('./settings.json')

// Backupers
const backupMongo = require('./backupers/mongo')
const backupMysql = require('./backupers/mysql')

const main = async () => {
    await initial() // Check configuration
    
    if (settings.backups.mongo.backup) 
        backupMongo()
    
    if (settings.backups.mysql.backup) 
        backupMysql()
}

main()