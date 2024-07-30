const express = require('express');
const router = express.Router();
const Task = require('../models/tasks'); 

// Get all tasks
router.get('/get', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one task
router.get('/:id', getTask, (req, res) => {
    res.json(res.task);
});

// Create a task
router.post('/add', async (req, res) => {
    console.log("Received Task Data:", req.body); // Log the incoming data
    const task = new Task(req.body);
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        console.error("Error adding task:", err); // Log the error
        res.status(400).json({ message: err.message });
    }
});

// Update a task
router.patch('/modify/:id', getTask, async (req, res) => {
    Object.assign(res.task, req.body);
    try {
        const updatedTask = await res.task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



router.delete('/delete/:id', getTask, async (req, res) => {
    try {
        console.log(`Attempting to delete task with ID: ${req.params.id}`); // Logging
        console.log(`Task found: ${res.task}`); // Logging the task found
        await res.task.deleteOne();
        console.log('Task deleted successfully'); // Logging
        res.json({ message: 'Deleted Task' });
    } catch (err) {
        console.error('Error deleting task:', err); // Logging the error
        res.status(500).json({ message: err.message });
    }
});


async function getTask(req, res, next) {
    let task;
    try {
        task = await Task.findById(req.params.id);
        if (task == null) {
            return res.status(404).json({ message: 'Cannot find task' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.task = task;
    next();
}

module.exports = router;
