const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Project = require('./models/project');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public')); // To serve static files

const PORT = 3000;

const mongoDBconnectString = "mongodb+srv://hieu2705:h17DMUiMUSeRl741@cluster0.v6rhigc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set('debug', true);

mongoose.connect(mongoDBconnectString)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

app.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error retrieving projects' });
  }
});

app.get('/project/:name', async (req, res) => {
  try {
    const projectName = req.params.name;

    if (!projectName) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const regex = new RegExp(projectName, 'i');
    const project = await Project.findOne({ name: regex });

    if (!project) {
      return res.status(404).json({ error: 'Project not found for the specified name' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error retrieving the project' });
  }
});

app.post('/project', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/project/:name', async (req, res) => {
  try {
    const projectName = req.params.name;
    const updatedData = req.body;

    if (!projectName || Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: 'Project name and updated data are required' });
    }

    if (updatedData.status === "Completed") {
      updatedData.endDate = new Date();
      console.log('Setting endDate:', updatedData.endDate); // Add this line
    }

    const updatedProject = await Project.findOneAndUpdate(
      { name: projectName },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found for the specified name' });
    }

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project records:', error);
    res.status(500).json({ error: 'Error updating project records' });
  }
});

app.delete('/project/:name', async (req, res) => {
  try {
    const projectName = req.params.name;

    if (!projectName) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const deletedProject = await Project.findOneAndDelete({ name: projectName });

    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found for the specified name' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project records:', error);
    res.status(500).json({ error: 'Error deleting project records' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
