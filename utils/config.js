require('dotenv').config();  //设置环境变量

//读取环境变量
const PORT = process.env.PORT;  //端口
const MONGODB_URI = process.env.MONGODB_URI;  //MongoDB 地址

module.exports = {
    PORT,
    MONGODB_URI
};