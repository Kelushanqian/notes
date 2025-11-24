const notesRouter = require('express').Router()
const Note = require('../models/note')

// http://localhost:3001/api/notes
// 获取所有笔记
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

// http://localhost:3001/api/notes/:id
// 获取单条笔记
notesRouter.get('/:id', async (request, response, next) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  } 
})

// http://localhost:3001/api/notes/:id
// 删除单条笔记
notesRouter.delete('/:id', async (request, response, next) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// http://localhost:3001/api/notes
// 创建新笔记
notesRouter.post('/', async (request, response, next) => {
  const body = request.body
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  const savedNote = await note.save()
  response.status(201).json(savedNote)
})

// http://localhost:3001/api/notes/:id
// 更新单条笔记
notesRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const note = {
    content: body.content,
    important: body.important,
  }
  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
  response.json(updatedNote)
})

module.exports = notesRouter