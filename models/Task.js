const mongoose = require('mongoose');

const task = new mongoose.Schema({
    task:String,
    desc:String,
    status:{type:Number, default:3},
    creator:{type:String},
    created_at:{type:Date, default:Date.now},
    start:{type:Date},
    finish:{type:Date},
    color:String,
    finished_at:{type:Date}
});

module.exports = mongoose.model("Task", task);