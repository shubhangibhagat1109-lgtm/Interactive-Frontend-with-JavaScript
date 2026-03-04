import { loadTasks, saveTasks } from "./modules/storage.js";
import { renderTaskList } from "./modules/render.js";
import { validateTaskInput } from "./modules/validation.js";

let tasks = loadTasks();
let currentFilter = "all";

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const counter = document.getElementById("task-counter");
const filterButtons = document.querySelectorAll(".filters button");

function createTask(text) {
  return {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
}

function updateCounter() {
  const activeTasks = tasks.filter(t => !t.completed).length;
  counter.textContent = `${activeTasks} task(s) remaining`;
}

function getFilteredTasks() {
  if (currentFilter === "active")
    return tasks.filter(t => !t.completed);

  if (currentFilter === "completed")
    return tasks.filter(t => t.completed);

  return tasks;
}

function render() {
  renderTaskList(taskList, getFilteredTasks());
  updateCounter();
}

taskForm.addEventListener("submit", e => {
  e.preventDefault();

  if (validateTaskInput(taskInput.value)) {
    tasks.push(createTask(taskInput.value));
    saveTasks(tasks);
    taskInput.value = "";
    render();
  }
});

taskList.addEventListener("click", e => {
  const taskElement = e.target.closest(".task");
  if (!taskElement) return;

  const id = Number(taskElement.dataset.id);
  const task = tasks.find(t => t.id === id);

  if (e.target.classList.contains("delete-btn")) {
    if (confirm("Are you sure?")) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks(tasks);
      render();
    }
  }

  if (e.target.type === "checkbox") {
    task.completed = e.target.checked;
    saveTasks(tasks);
    render();
  }
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();