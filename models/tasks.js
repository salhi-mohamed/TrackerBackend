const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    priority: { type: String, required: true },
    status: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: String, required: true },
    reminderEnabled: { type: Boolean, required: true },
    reminder: { type: Date, required: true }
}, { versionKey: false });

module.exports = mongoose.model('Task', taskSchema);
