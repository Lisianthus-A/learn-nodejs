require('dotenv').config();  //设置环境变量

//读取环境变量
const PORT = process.env.PORT;  //端口
const mongoUri = process.env.MONGODB_URI;

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const Note = require('./models/note');  //Note 模型

//连接数据库
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log('connected to MongoDb');
    })
    .catch(error => {
        console.log('error connecting to MongoDB: ', error.message);
    });

//处理 json 数据，转换成 js 对象，附加到 request 的 body 属性上
app.use(express.json());

//Logger 中间件
const logger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
};
app.use(logger);

//请求根目录
app.get('/', (request, response) => {
    response.send('Hello world!');
});

//获取所有 note
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    });
});

//添加 note
app.post('/api/notes', (request, response, next) => {
    const { content, important } = request.body;

    const note = new Note({
        content,
        important: important || false,
        date: new Date()
    });

    //保存 note 到数据库后，返回已保存的对象
    note.save()
        .then(savedNote => savedNote.toJSON())
        .then(savedAndFormattedNote => {
            response.json(savedAndFormattedNote);
        })
        .catch(error => next(error));
});

//更新指定 id 的 note
app.put('/api/notes/:id', (request, response, next) => {
    const { id } = request.params;
    const { content, important } = request.body;
    const note = { content, important };

    Note.findByIdAndUpdate(id, note, { new: true })  //new 选项控制是否返回更新后的 note
        .then(updatedNote => {
            response.json(updatedNote);
        })
        .catch(error => next(error));
});

//获取指定 id 的 note
app.get('/api/notes/:id', (request, response, next) => {
    const { id } = request.params;
    Note.findById(id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

//删除指定 id 的 note
app.delete('/api/notes/:id', (request, response, next) => {
    const { id } = request.params;
    Note.findByIdAndRemove(id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

//错误处理中间件
const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        response.status(400).send({ error: 'malformatted id' });
        return;
    } else if (error.name === 'ValidationError') {
        response.status(400).json({ error: error.message });
        return;
    }

    next(error);
};
app.use(errorHandler);

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
