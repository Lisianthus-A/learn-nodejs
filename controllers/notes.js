const notesRouter = require('express').Router();
const Note = require('../models/note');

//获取所有 note
notesRouter.get('/', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    });
});

//获取指定 id 的 note
notesRouter.get('/:id', (request, response, next) => {
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

//新增 note
notesRouter.post('/', (request, response, next) => {
    const { content, important } = request.body;

    const note = new Note({
        content,
        important: important || false,
        date: new Date()
    });

    //保存 note 到数据库后，返回已保存的对象
    note.save()
        .then(savedNote => {
            response.json(savedNote);
        })
        .catch(error => next(error));
});

//删除指定 id 的 note
notesRouter.delete('/:id', (request, response, next) => {
    const { id } = request.params;
    Note.findByIdAndRemove(id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

//更新指定 id 的 note
notesRouter.put('/:id', (request, response, next) => {
    const { id } = request.params;
    const { content, important } = request.body;
    const note = { content, important };

    Note.findByIdAndUpdate(id, note, { new: true })  //new 选项控制是否返回更新后的 note
        .then(updatedNote => {
            response.json(updatedNote);
        })
        .catch(error => next(error));
});

module.exports = notesRouter;