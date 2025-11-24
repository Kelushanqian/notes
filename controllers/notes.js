const notesRouter = require('express').Router()
const Note = require('../models/note')

// http://localhost:3001/api/notes
// 获取所有笔记
notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// http://localhost:3001/api/notes/1
// 获取单条笔记
notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// http://localhost:3001/api/notes/2
// 删除单条笔记
notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// http://localhost:3001/api/notes
// 创建新笔记
notesRouter.post('/', (request, response, next) => {
  const body = request.body
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  note.save().then(savedNote => {
    response.json(savedNote)
  })
  .catch(error => next(error))
})

// http://localhost:3001/api/notes/2
// 更新单条笔记
notesRouter.put('/:id', (request, response, next) => {
  const body = request.body
  const note = {
    content: body.content,
    important: body.important,
  }
  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter