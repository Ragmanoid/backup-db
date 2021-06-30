const util = require('util')
const exec = util.promisify(require('child_process').exec)

const cmd = async c => {
    try {
        await exec(c)
        return true
    } catch (err){
        console.error(err)
        return false
    }
}

module.exports = cmd