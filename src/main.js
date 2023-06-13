const express = require('express')
const app = express()
const session = require('express-session')
const bodyParser = require('body-parser')
const tasksController = require('./controller/taskController.js')
const authController = require('./controller/authController.js')

// Session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {}
}))

// Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: false }))

// GET endpoint to get all tasks
app.get('/tasks', (req, res) => {
  tasksController.getTasks(req, res)
})

// GET endpoint to get a task by id
app.get('/tasks/:id', (req, res) => {
  tasksController.getTask(req, res)
})

// POST endpoint to create a new task
app.post('/tasks', (req, res) => {
  tasksController.postTask(req, res)
})

// PUT endpoint to update a task by id
app.put('/tasks/:id', (req, res) => {
  tasksController.putTask(req, res)
})

// DELETE endpoint to delete a task by id
app.delete('/tasks/:id', (req, res) => {
  tasksController.deleteTask(req, res)
})

// POST endpoint to login
app.post('/login', (req, res) => {
  authController.login(req, res)
})

// GET endpoint to verify if user is logged in
app.get('/verify', (req, res) => {
  authController.verify(req, res)
})

// DELETE endpoint to logout
app.delete('/logout', (req, res) => {
  authController.logout(req, res)
})

// Not existing endpoints redirected to 404 Page
app.all('*', (req, res) => {
  res.status(404).send('<h1>404! Page not found</h1>')
})

app.listen(3000, () => {
  console.log('Server listening on port 3000')
}
)
