const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const notesRouter = require('./controllers/notes');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

logger.info('connecting to', config.MONGODB_URI);

//连接数据库
mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        logger.info('connected to MongoDB');
    })
    .catch(error => {
        logger.error('error connecting to MongoDB: ', error.message);
    });

//处理 json 数据，转换成 js 对象，附加到 request 的 body 属性上
app.use(express.json());
app.use(middleware.requestLogger);  //打印请求基本内容

app.use('/api/notes', notesRouter);

app.use(middleware.unknownEndpoint);  //404
app.use(middleware.errorHandler);  //错误处理

module.exports = app;