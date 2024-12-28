import express from 'express';
import { tasksData } from './tasksData';
import { v4 as uuidv4 } from 'uuid';
import './db';
import asyncHandler from 'express-async-handler';

const router = express.Router(); 

router.get('/', (req, res) => {
    res.json(tasksData);
});

router.get('/', async (req, res) => {
    const tasks = await Task.find().populate('userId', 'username');
    res.status(200).json(tasks);
});
router.post('/', asyncHandler(async (req, res) => {
    const task = await Task(req.body).save();
    res.status(201).json(task);
}));


router.put('/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasksData.tasks.findIndex(task => task.id === id); 
    if (taskIndex === -1) {
        return res.status(404).json({ status: 404, message: 'Task not found' });
    }
    const updatedTask = { ...tasksData.tasks[taskIndex], ...req.body, id:id,
        updated_at: new Date().toISOString()
    };
    tasksData.tasks[taskIndex] = updatedTask;
    res.json(updatedTask);
});
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasksData.tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) return res.status(404).json({status:404,message:'Task not found'});
    tasksData.tasks.splice(taskIndex, 1);
    res.status(204).send();
    tasksData.total_results--;
});
export default router;