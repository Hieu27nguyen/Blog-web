// ----------------------------------------------
// TCSS 460: Summer 2024
// Backend Project Tracker API
// ----------------------------------------------
// Use MongoDB as a cloud database
// ----------------------------------------------

// Import Express.js, Mongoose, Project Schema
// and CORS
const express = require('express');
const mongoose = require('mongoose');
const Project = require('./models/project');
const cors = require('cors');

// Create an express application instance
// This represents the Backend API
const app = express();

// Parse incoming request bodies with JSON payloads
// Each parsed JSON will be available in req.body
app.use(express.json()); 

// Enable Cross Origin requests in Express.js app
// Allow requests from any origin (allow all origins)
app.use(cors());

// Set the port number 
const PORT = 3000;

// MongoDB Connection String
const mongoDBconnectString = "mongodb+srv://hieu2705:h17DMUiMUSeRl741@cluster0.v6rhigc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Enable Mongoose debugging
mongoose.set('debug', true);

mongoose.connect(mongoDBconnectString)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Develop the routes

// ----------------------------------------------
// (1) Retrieve all projects
// root URI: http://localhost:port/
app.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error retrieving projects' });
  }
});

// ----------------------------------------------
// (2) Retrieve a project by project name
// project name URI: http://localhost:port/project/:name
app.get('/project/:name', async (req, res) => {
  try {
    const projectName = req.params.name;

    // Validate if the project name is provided
    if (!projectName) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Perform a case-insensitive search for the project name
    const regex = new RegExp(projectName, 'i');
    const project = await Project.findOne({ name: regex });

    // Check if project records are found for the specified name
    if (!project) {
      return res.status(404).json({ error: 'Project not found for the specified name' });
    }

    // Respond with the project records for the specified name as JSON
    res.json(project);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error retrieving the project' });
  }
});

// ----------------------------------------------
// (3) Insert a new project
// project name URI: http://localhost:port/project
app.post('/project', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------
// (4) Update an existing project by project name
// project name URI: http://localhost:port/project/:name
app.put('/project/:name', async (req, res) => {
  try {
    const projectName = req.params.name;
    const updatedData = req.body;

    // Validate if the project name and updated data are provided
    if (!projectName || Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: 'Project name and updated data are required' });
    }

    // Find the project document by project name and update
    const updatedProject = await Project.findOneAndUpdate(
      { name: projectName }, // Find document by project name
      updatedData, // Updated data object
      { new: true } // Return the updated document
    );

    // Check if the project document is found and updated successfully
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found for the specified name' });
    }

    // Respond with the updated project document
    res.json(updatedProject);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error updating project records' });
  }
});

// ----------------------------------------------
// (5) Delete a project by project name
// project name URI: http://localhost:port/project/:name
app.delete('/project/:name', async (req, res) => {
  try {
    const projectName = req.params.name;

    // Validate if the project name is provided
    if (!projectName) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Find and delete the project document by project name
    const deletedProject = await Project.findOneAndDelete({ name: projectName });

    // Check if the project document is found and deleted successfully
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found for the specified name' });
    }

    // Respond with a success message
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project records:', error);
    res.status(500).json({ error: 'Error deleting project records' });
  }
});

// ----------------------------------------------
// Create a server that binds and listens on the specified host and port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
