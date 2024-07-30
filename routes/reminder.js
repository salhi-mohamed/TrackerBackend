const Task = require('../models/tasks'); 

const checkReminders = async (wss) => {
  const now = new Date();
  try {
    const tasks = await Task.find({ reminderEnabled: true, reminder: { $lte: now }, reminded: false });
    tasks.forEach(async task => {
      task.reminded = true;
      await task.save();

      wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({ message: `Reminder for task: ${task.title} is due now!`, task }));
        }
      });

      console.log(`Reminder for task: ${task.title} is due now!`);
    });
  } catch (err) {
    console.error('Error checking reminders:', err);
  }
};

module.exports = checkReminders;
