module.exports = (env) => {
    if (env.NODE_ENV === 'production') {
        return require('./prod.config.js');
    } else {
        return require('./dev.config');
    }
}