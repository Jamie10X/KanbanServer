const express = require('express');
const router = express.Router();
require('dotenv').config();
const sauce = process.env.sauce;
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');

router.post('/task', async (req,res)=>{
    const {task, desc, start, finish, color, status, token} = req.body;
    try {
        
        if(!token) return res.status(403).json({message:'token absent'});
        const decoded = jwt.decode(token, sauce);
        
        if(!decoded.id) return res.status(403).json({message:'id absent'});
        const newtask = new Task({
            task,
            desc,
            start,
            finish,
            color,
            status,
            creator: decoded.id
        });
        const newone = await newtask.save();
        res.status(200).json({message:'task created', task:newone});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'something happened while creating the task'});
    }
});

router.post('/status', async (req,res)=>{
    const {id, status, token} = req.body;
    try {
        if(!token) return res.status(403).json({message:'token absent'});
        const decoded = jwt.decode(token, sauce);
        if(!decoded.id) return res.status(403).json({message:'id absent'});
        const modified = await Task.findByIdAndUpdate(id, { status });
        res.status(200).json({modified});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'something happened while creating the task'});
    }
});
router.post('/all', async (req,res)=>{
    const {token} = req.body;
    try {
        if(!token) return res.status(403).json({message:'token absent'});
        const decoded = jwt.decode(token, sauce);
        if(!decoded.id) return res.status(403).json({message:'id absent'});
       const tasks = await Task.find({creator:decoded.id});
        res.status(200).json({tasks});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'something happened while getting all tasks'});
    }
});
router.post('/delete', async (req, res) => {
    const { id, token } = req.body;
    try {
        // Verify the token
        if (!token) return res.status(403).json({ message: 'token absent' });
        const decoded = jwt.decode(token, sauce);
        if (!decoded.id) return res.status(403).json({ message: 'id absent' });
        // Find and delete the task
        const deletedTask = await Task.findOneAndDelete({ _id: id, creator: decoded.id });
        console.log(deletedTask)
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        res.status(200).json({ message: 'Task deleted successfully', deletedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something happened while deleting the task' });
    }
});

router.post('/modify', async (req,res)=>{
    const {selectedTask, token} = req.body;
    try {
        if(!token) return res.status(403).json({message:'token absent'});
        const decoded = jwt.decode(token, sauce);
        if(!decoded.id) return res.status(403).json({message:'id absent'});
        const modified = await Task.findByIdAndUpdate(selectedTask._id, {
            task:selectedTask.task, desc:selectedTask.desc, start:selectedTask.start, 
            finish:selectedTask.finish, color:selectedTask.color, status:selectedTask.status
        });
        res.status(200).json({modified});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'something happened while modifying the task'});
    }
});
module.exports = router;


