const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middlewares/authMiddleware");

// Create task
router.post("/", authMiddleware, async (req, res) => {
  const { title, dueDate } = req.body;
  const task = new Task({
    userId: req.user.id,
    title,
    dueDate,
  });
  await task.save();
  res.status(201).json(task);
});

// Get all tasks
router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id }).sort({ dueDate: 1 });
  res.status(200).json(tasks);
});

// Update task
router.put("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true },
  );
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.status(200).json(task);
});

// Delete task
router.delete("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.status(200).json({ message: "Task deleted" });
});

module.exports = router;
