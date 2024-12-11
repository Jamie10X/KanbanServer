// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    task: { type: String, required: true },
    desc: { type: String },
    status: {
        type: String,
        enum: ['Todo', 'In Progress', 'Done'],
        default: 'Todo',
        required: true
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, default: Date.now },
    start: { type: Date },
    finish: { type: Date },
    color: { type: String },
    finished_at: { type: Date }
});

module.exports = mongoose.model("Task", taskSchema);