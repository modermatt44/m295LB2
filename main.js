const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));

// Session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {}
}));

// List of tasks
const tasks = [
    {
        id: 1,
        name: 'Task 1',
        description: 'Description 1',
        completed: false
    },
    {
        id: 2,
        name: 'Task 2',
        description: 'Description 2',
        completed: false
    },
    {
        id: 3,
        name: 'Task 3',
        description: 'Description 3',
        completed: false
    }
];

function checkLogin(req, res) {
    if (!req.session.user) {
        res.status(403).json({ error: 'Not logged in' });
        return;
    }
}

// GET endpoint to get all tasks
app.get('/tasks', (req, res) => {
    checkLogin(req, res);
    res.json(tasks);
});

// POST endpoint to create a new task
app.post('/tasks', (req, res) => {
    checkLogin(req, res);
    // Always increment the id by 1 with math.max
    const id = Math.max(...tasks.map(task => task.id)) + 1;
    const name = req.body.name;
    const description = req.body.description;
    const completed = false;
    const task = tasks.find(task => task.id === id);
    if (task) {
        return res.status(409).send('Task already exists');
    } else if (!name || !description) {
        return res.status(422).send('Missing name or description');
    } else {
        tasks.push({ id, name, description, completed });
        res.status(201).json({ id, name, description, completed });
    }
});

// GET endpoint to get a task by id
app.get('/tasks/:id', (req, res) => {
    checkLogin(req, res);
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (task) {
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

// PUT endpoint to update a task by id
app.put('/tasks/:id', (req, res) => {
    checkLogin(req, res);
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (!task) {
        return res.status(404).send('Task not found');
    } else if (!req.body.name || !req.body.description || !req.body.completed) {
        return res.status(422).send('Missing name, description or completed');
    } else {
        task.name = req.body.name;
        task.description = req.body.description;
        task.completed = req.body.completed;
        res.status(200).json(task);
    }
});

// DELETE endpoint to delete a task by id
app.delete('/tasks/:id', (req, res) => {
    checkLogin(req, res);
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (!task) {
        return res.status(404).send('Task not found');
    } else {
        tasks.splice(tasks.indexOf(task), 1);
        res.status(200).send(task);
    }
});

// POST endpoint to login accepts all combinations of email using validateEmail() method. Password has to be: "m295"
app.post('/login', (req, res) => {
    const email = req.body.email;
    // Regex copied from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const validatedEmail = email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    const password = req.body.password;
    if (!email || !password) {
        return res.status(422).send('Missing email or password');
    } else if (!validatedEmail) {
        return res.status(422).send('Invalid email');
    } else if (password !== 'm295') {
        return res.status(401).send('Invalid password');
    } else {
        req.session.user = { email: email, password: password };
        res.status(200).send(req.session.user);
    }
});

// GET endpoint to verify if user is logged in
app.get('/verify', (req, res) => {
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(401).send('User is not logged in');
    }
});

// DELETE endpoint to logout
app.delete('/logout', (req, res) => {
    req.session.destroy();
    res.sendStatus(204);
});

// Not existing endpoints redirected to 404 Page
app.all('*', (req, res) => {
    res.status(404).send('<h1>404! Page not found</h1>');
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
}
);