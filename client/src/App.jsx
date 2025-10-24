import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === "") return;
    const newItem = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };
    setTasks([...tasks, newItem]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-green-700 mb-8 tracking-tight">
        🦖 Taskosaurus
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Skriv en ny uppgift..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <button
          onClick={addTask}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
        >
          Lägg till
        </button>
      </div>

      <ul className="w-full max-w-md">
        {tasks.map(task => (
          <li
            key={task.id}
            className="flex justify-between items-center bg-white rounded-lg p-3 mb-3 shadow hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="h-5 w-5 text-green-500 focus:ring-green-400 border-gray-300 rounded"
              />
              <span
                className={`${
                  task.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                } text-lg`}
              >
                {task.text}
              </span>
            </div>
            <button
              onClick={() => removeTask(task.id)}
              className="text-red-500 hover:text-red-700 transition"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && (
        <p className="text-gray-500 mt-8 italic">Inga uppgifter ännu...</p>
      )}
    </div>
  );
}

export default App;
