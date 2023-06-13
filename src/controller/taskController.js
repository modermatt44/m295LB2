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
exports.getTasks = (req, res) => {
    checkLogin(req, res);
    res.json(tasks);
}

// POST endpoint to create a new task
exports.postTask = (req, res) => {
    checkLogin(req, res);
    // Always increment the id by 1 with math.max
    const id = Math.max(...tasks.map(task => task.id)) + 1;
    const name = req.body.name;
    const description = req.body.description;
    const completed = false;
    const task = tasks.find(task => task.id === id);
    if (task) {
        return res.status(409).json({ error: 'Task already exists' });
    } else if (!name || !description) {
        return res.status(422).json({ error: 'Missing name or description' });
    } else {
        tasks.push({ id, name, description, completed });
        res.status(201).json({ id, name, description, completed });
    }
};

// GET endpoint to get a task by id
exports.getTask = (req, res) => {
    checkLogin(req, res);
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
};

// PUT endpoint to update a task by id
exports.putTask = (req, res) => {
    checkLogin(req, res);
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    } else if (!req.body.name || !req.body.description || !req.body.completed) {
        return res.status(422).json({ error: 'Missing name, description or completed' });
    } else {
        task.name = req.body.name;
        task.description = req.body.description;
        task.completed = req.body.completed;
        res.status(200).json(task);
    }
};

// DELETE endpoint to delete a task by id
exports.deleteTask = (req, res) => {
    checkLogin(req, res);
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    } else {
        tasks.splice(tasks.indexOf(task), 1);
        res.status(200).send(task);
    }
};