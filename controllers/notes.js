const notesRouter = require('express').Router();
const Note = require('../models/note');

//获取所有 note
notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({});
    response.json(notes);
});

//获取指定 id 的 note
notesRouter.get('/:id', async (request, response, next) => {
    const { id } = request.params;

    const note = await Note.findById(id);
    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
});

//新增 note
notesRouter.post('/', async (request, response, next) => {
    const { content, important } = request.body;

    const note = new Note({
        content,
        important: important || false,
        date: new Date()
    });

    //保存 note 到数据库后，返回已保存的对象
    const savedNote = await note.save();
    response.json(savedNote);
});

//删除指定 id 的 note
notesRouter.delete('/:id', async (request, response, next) => {
    const { id } = request.params;
    await Note.findByIdAndRemove(id);
    response.status(204).end();
});

//更新指定 id 的 note
notesRouter.put('/:id', async (request, response, next) => {
    const { id } = request.params;
    const { content, important } = request.body;
    const note = { content, important };

    const updatedNote = await Note.findByIdAndUpdate(id, note, { new: true });  //new 选项控制是否返回更新后的 note
    response.json(updatedNote);
});

module.exports = notesRouter;