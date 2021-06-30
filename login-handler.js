const mega = require('megajs')

const getLoggedAccount = options => {
    if (!options.email) {
        throw new Error('ERROR: email is not defined')
    }

    if (!options.password) {
        throw new Error('ERROR: password is not defined')
    }

    const storage = new mega.Storage({
        email: options.email,
        password: options.password,
        autologin: false,
        keepalive: false
    })

    return new Promise(resolve => {
        storage.login(err => {
        if (err)
            resolve({ err })
        else
            resolve({ err, storage })
        })
    })

    
}

exports.getLoggedAccount = getLoggedAccount