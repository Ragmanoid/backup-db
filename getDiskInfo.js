const axios = require('axios')

module.exports = async apiKey => {
    if (!apiKey) {
        throw new Error('ERROR: apiKey is not defined')
    }
    
    try {
        let query = `https://cloud-api.yandex.net/v1/disk/resources?path=%2F`
        let result = await axios.get(query, {
            headers: {
                Authorization: `OAuth ${apiKey}`
            }
        })
        
        return result.data
    }
    catch (e) {
        return e.response.data
    }
}