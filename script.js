// DOM elements
const taskInput = document.getElementById("taskInput");
const reminderInput = document.getElementById("reminderInput");
const taskTypeInput = document.getElementById("taskTypeInput");
const addTaskButton = document.getElementById("addTaskButton");
const dailyTasksElement = document.getElementById("dailyTasks");
const weeklyTasksElement = document.getElementById("weeklyTasks");
const ongoingTasksElement = document.getElementById("ongoingTasks");

const completedTasksElement = document.getElementById("completedTasks");
const motivationBox = document.getElementById("motivationBox");
const motivationText = document.getElementById("motivationText");
const closeMotivationButton = document.getElementById("closeMotivationButton");
const reminderDisplay = document.getElementById("reminderDisplay");

// Array to store tasks
let tasks = [];

// Event listener for adding tasks
addTaskButton.addEventListener("click", addTask);

// Event listener to close the motivation box
closeMotivationButton.addEventListener("click", () => {
  motivationBox.style.display = "none";
});

// Add task function
function addTask() {
  const taskText = taskInput.value.trim();
  const reminderTime = reminderInput.value;
  const taskType = taskTypeInput.value; // Get the selected task type (daily or weekly)

  if (taskText) {
    // Calculate due date for weekly tasks
    let dueDate = null;
    if (taskType === "weekly") {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 7); // Set the due date to 7 days from now
      dueDate = currentDate.toISOString(); // Save the due date in ISO format
    }

    // Set end of the day for daily tasks
    let dailyDeadline = null;
    if (taskType === "daily") {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set to end of the day
      dailyDeadline = today.toISOString();
    }

    // Create a task object and add it to tasks array
    const task = {
      text: taskText,
      status: "active", // Task status can be 'active', 'ongoing', or 'completed'
      reminderTime: reminderTime ? new Date(reminderTime).toISOString() : null, // Ensure ISO format
      type: taskType, // Store the task type (daily or weekly)
      dueDate: dueDate, // Store due date for weekly tasks
      dailyDeadline: dailyDeadline, // Store end-of-day deadline for daily tasks
      completionDate: null, // Store the date when the task was completed
    };
    tasks.push(task);

    // Set a reminder if reminder time is specified
    if (task.reminderTime) {
      const reminderDate = new Date(task.reminderTime);
      const now = new Date();
      if (reminderDate > now) {
        setTimeout(() => {
          alert(`Reminder: Time to check your task - ${task.text}`);
        }, reminderDate - now);
      }
    }

    // Render tasks to the DOM
    renderTasks();

    // Clear input fields
    taskInput.value = "";
    reminderInput.value = "";
  }
}

// Render tasks based on their status and type (daily or weekly)
function renderTasks() {
  // Clear current list items
  dailyTasksElement.innerHTML = "";
  weeklyTasksElement.innerHTML = "";
  ongoingTasksElement.innerHTML = "";
  completedTasksElement.innerHTML = "";

  tasks.forEach((task, i) => {
    const taskItem = document.createElement("li");
    let taskDescription = task.text;

    // If the task is weekly, add a due date message (but not for completed tasks)
    if (task.type === "weekly" && task.dueDate && task.status !== "completed") {
      const dueDate = new Date(task.dueDate);
      taskDescription += ` (Due by: ${dueDate.toDateString()})`; // Add due date info
    }

    // If the task is daily, add a "Due Today" message (but not for completed tasks)
    if (
      task.type === "daily" &&
      task.dailyDeadline &&
      task.status !== "completed"
    ) {
      const today = new Date();
      const deadlineDate = new Date(task.dailyDeadline);

      if (today <= deadlineDate) {
        taskDescription += " (Due Today)";
      }
    }



