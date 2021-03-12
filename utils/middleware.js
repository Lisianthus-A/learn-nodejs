const logger = require('./logger');

//打印请求基本内容
const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method);
    logger.info('Path:  ', request.path);
    logger.info('Body:  ', request.body);
    logger.info('---');
    next();
};

//处理 404 响应
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

//错误处理
const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {  //请求缺失 id
        response.status(400).send({ error: 'malformatted id' });
        return;
    } else if (error.name === 'ValidationError') {  //表单未通过验证
        response.status(400).json({ error: error.message });
        return;
    }

    next(error);
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
};