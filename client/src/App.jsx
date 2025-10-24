import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

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

  const clearCompleted = () => {
    setTasks(tasks.filter(t => !t.completed));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    if (editingText.trim() === "") return;
    setTasks(tasks.map(t => (t.id === id ? { ...t, text: editingText } : t)));
    setEditingId(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg border border-gray-200">
        <h1 className="text-4xl font-extrabold text-green-700 mb-8 text-center">
          🦖 Taskosaurus
        </h1>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Skriv en ny uppgift..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <button
            onClick={addTask}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
          >
            Lägg till
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex justify-center gap-3 mb-6">
          {["all", "active", "completed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                filter === f
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f === "all" ? "Alla" : f === "active" ? "Aktiva" : "Klara"}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="text-center mb-4 text-gray-700 font-semibold">
          {total > 0 ? `${completed} / ${total} klara` : "Inga uppgifter ännu"}
        </div>

        {/* Task List */}
        <ul className="space-y-2">
          {filteredTasks.map(task => (
            <li
              key={task.id}
              className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="h-5 w-5 text-green-500 focus:ring-green-400 border-gray-300 rounded"
                />

                {editingId === task.id ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => saveEdit(task.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(task.id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                    autoFocus
                  />
                ) : (
                  <span
                    onDoubleClick={() => startEditing(task.id, task.text)}
                    className={`cursor-pointer select-none ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    } text-lg`}
                    title="Dubbelklicka för att redigera"
                  >
                    {task.text}
                  </span>
                )}
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

        {/* Clear Completed */}
        {completed > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={clearCompleted}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
            >
              Rensa klara uppgifter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
