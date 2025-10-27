import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Task from "./models/Task.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- ROUTES ---

// 🟢 GET all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
});

// 🟡 POST create new task
app.post("/tasks", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Text is required" });
    }
    const newTask = await Task.create({ text });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Server error while creating task" });
  }
});

// 🔵 PUT update a task (toggle or edit)
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error while updating task" });
  }
});

// 🔴 DELETE a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting task" });
  }
});

// --- TEST route ---
app.get("/", (req, res) => {
  res.send("🦖 Taskosaurus API is roaring!");
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
