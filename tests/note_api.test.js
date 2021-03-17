const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Note = require('../models/note');

//测试前
beforeEach(async () => {
    //清除测试数据库，添加测试用数据
    await Note.deleteMany({});

    for (const note of helper.initialNotes) {
        const noteObject = new Note(note);
        await noteObject.save();
    }
});

describe('初始 note 已保存时', () => {
    test('Content-Type 为 json 类型', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('note 长度是否正常', async () => {
        const response = await api.get('/api/notes');

        expect(response.body).toHaveLength(helper.initialNotes.length);
    });

    test('是否正常保存 content 数据', async () => {
        const response = await api.get('/api/notes');

        const contents = response.body.map(r => r.content);
        expect(contents).toContain('Browser can execute only Javascript');
    });
});

describe('测试指定 note', () => {
    test('合法 id 返回 200', async () => {
        const notesAtStart = await helper.notesInDb();

        const noteToView = notesAtStart[0];

        const resultNote = await api
            .get(`/api/notes/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const processedNoteToView = JSON.parse(JSON.stringify(noteToView));
        expect(resultNote.body).toEqual(processedNoteToView);
    });

    test('不存在则返回 404', async () => {
        const validNonexistingId = await helper.nonExistingId();

        console.log(validNonexistingId);

        await api
            .get(`/api/notes/${validNonexistingId}`)
            .expect(404);
    });

    test('非法 id 返回 400', async () => {
        const invalidId = '5a3d5da59070081a82a3445';

        await api
            .get(`/api/notes/${invalidId}`)
            .expect(400);
    });
});

describe('添加新 note', () => {
    test('添加合法 note', async () => {
        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true,
        };

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const notesAtEnd = await helper.notesInDb();
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

        const contents = notesAtEnd.map(n => n.content);

        expect(contents).toContain(
            'async/await simplifies making async calls'
        );
    });

    test('非法 note 返回 400', async () => {
        const newNote = {
            important: true
        };

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400);

        const notesAtEnd = await helper.notesInDb();

        expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
    });

});

describe('删除 note', () => {
    test('合法 id 返回 204', async () => {
        const notesAtStart = await helper.notesInDb();
        const noteToDelete = notesAtStart[0];

        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(204);

        const notesAtEnd = await helper.notesInDb();

        expect(notesAtEnd).toHaveLength(
            helper.initialNotes.length - 1
        );

        const contents = notesAtEnd.map(r => r.content);

        expect(contents).not.toContain(noteToDelete.content);
    });
});

//测试后
afterAll(() => {
    mongoose.connection.close();
});