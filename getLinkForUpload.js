const axios = require('axios')

module.exports = async ({
    apiKey,
    path
}) => {
    if (!apiKey) {
        throw new Error('ERROR: apiKey is not defined')
    }

    if (!path) {
        throw new Error('ERROR: path is not defined')
    }

    try {
        let query = `https://cloud-api.yandex.net/v1/disk/resources/upload?path=${encodeURIComponent(path)}`
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