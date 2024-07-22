const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  tasks: [
    {
      name: { type: String, required: true },
      description: { type: String },
      status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
      dueDate: { type: Date }
    }
  ]
}, { collection: 'projects' });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
