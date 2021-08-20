const baseUrl = process.env.NODE_ENV === 'development' ? 'http://11.1.1.136:26001/api' : '/api'
const baseImageUrl = process.env.NODE_ENV === 'development' ? 'http://11.1.1.136:9000/' : ''

module.exports = {
    baseUrl,
    baseImageUrl,
}
