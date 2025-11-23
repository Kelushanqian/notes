require('dotenv').config()
const express = require('express')
const Note = require('./models/note')

const app = express()

app.use(express.json())
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

// http://localhost:3001/
// 打印hello world
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// http://localhost:3001/api/notes
// 获取所有笔记
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// http://localhost:3001/api/notes/1
// 获取单条笔记
app.get('/api/notes/:id', (request, response, next) => {
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
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// http://localhost:3001/api/notes
// 创建新笔记
app.post('/api/notes', (request, response, next) => {
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
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body
  Note.findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }
      note.content = content
      note.important = important
      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})