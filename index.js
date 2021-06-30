const cron = require('node-cron')

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

    // Start backups
    if (settings.backups.mongo.backup) 
        cron.schedule(settings.backups.mongo.schedule, backupMongo)
    
    if (settings.backups.mysql.backup) 
        cron.schedule(settings.backups.mysql.schedule, backupMysql)
}

main()