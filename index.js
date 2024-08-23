const { initial } = require('./initial')
const settings = require('./settings.json')

// Backupers
const backupMongo = require('./backupers/mongo')
const backupMysql = require('./backupers/mysql')
const backupPostgres = require('./backupers/postgres')

const main = async () => {
    await initial() // Check configuration
    
    if (settings.backups.mongo.backup) 
        backupMongo()
    
    if (settings.backups.mysql.backup) 
        backupMysql()
    
    if (settings.backups.postgres.backup) 
        backupPostgres(settings.backups.postgres)
}

main()