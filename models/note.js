const mongoose = require('mongoose');

//定义 Schema 模式
const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
});

//定义 Schema 的 toJSON 方法
noteSchema.set('toJSON', {
    transform(document, returnedObject) {
        returnedObject.id = returnedObject._id.toString();  //将 _id 字段赋给 id
        //防止返回 _id 和 __v 字段
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

//定义 Model，将在数据库创建名为 notes 的集合保存所有 note
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;