const env = process.env.NODE_ENV;

const info = (...params) => {
    env !== 'test' && console.log(...params);
};

const error = (...params) => {
    env !== 'test' && console.error(...params);
};

module.exports = {
    info, error
};