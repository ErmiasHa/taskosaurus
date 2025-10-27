import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // 🟢 Hämta uppgifter från API
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      console.error("Fel vid hämtning:", err);
    }
  };

  // 🟡 Lägg till uppgift
  const addTask = async () => {
    if (newTask.trim() === "") return;
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newTask }),
    });
    const data = await res.json();
    setTasks([data, ...tasks]);
    setNewTask("");
  };

  // 🔵 Uppdatera uppgift (markera klar/ändra text)
  const updateTask = async (id, updates) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setTasks(tasks.map((t) => (t._id === id ? updated : t)));
  };

  // 🔴 Ta bort uppgift
  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;

  if (loading) return <p className="text-center mt-10">Laddar uppgifter...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg border border-gray-200">
        <h1 className="text-4xl font-extrabold text-green-700 mb-8 text-center">
          🦖 Taskosaurus
        </h1>

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

        <div className="flex justify-center gap-3 mb-6">
          {["all", "active", "completed"].map((f) => (
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

        <div className="text-center mb-4 text-gray-700 font-semibold">
          {total > 0 ? `${completed} / ${total} klara` : "Inga uppgifter ännu"}
        </div>

        <ul className="space-y-2">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => updateTask(task._id, { completed: !task.completed })}
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
                onClick={() => deleteTask(task._id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
