require('dotenv').config();  //设置环境变量

//读取环境变量
const PORT = process.env.PORT;  //端口
const MONGODB_URI = process.env.NODE_ENV === 'test'  //MongoDB 地址
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = {
    PORT,
    MONGODB_URI
};