const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { WebSocketServer } = require('ws');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const tasksRouter = require('./routes/tasks');
app.use('/tasks', tasksRouter); // This should match the base URL in your Angular service

mongoose.connect('mongodb://localhost:27017/tracker')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Import and use the reminder check function
const checkReminders = require('./routes/reminder');

// Create WebSocket server
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', ws => {
    console.log('New client connected');
    ws.on('close', () => console.log('Client disconnected'));
});

// Periodically check reminders and notify clients
setInterval(() => {
    checkReminders(wss);
}, 60000); // Check every minute

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
