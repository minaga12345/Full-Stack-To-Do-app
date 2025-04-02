import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaSignOutAlt } from "react-icons/fa";
import TaskItem from "../components/TaskItem";

const toLocalDatetime = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", dueDate: "" });
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("dueDateAsc");
  const [filterDate, setFilterDate] = useState("");
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchUserAndTasks = async () => {
      try {
        const resUser = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(resUser.data);

        const resTasks = await axios.get("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(resTasks.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserAndTasks();
  }, [navigate, token]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    setError("");

    if (!newTask.title || !newTask.dueDate) {
      return setError("Title and due date are required.");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([...tasks, res.data]);
      setNewTask({ title: "", dueDate: "" });
    } catch (err) {
      setError("Failed to create task.");
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const resetFilters = () => {
    setFilterDate("");
    setRangeFrom("");
    setRangeTo("");
    setStatusFilter("all");
    setSortBy("dueDateAsc");
  };

  const filteredTasks = tasks
    .filter((task) => {
      const taskDate = new Date(task.dueDate);
      if (filterDate && taskDate.toISOString().split("T")[0] !== filterDate)
        return false;
      if (rangeFrom && new Date(task.dueDate) < new Date(rangeFrom))
        return false;
      if (rangeTo && new Date(task.dueDate) > new Date(rangeTo)) return false;
      if (statusFilter === "completed" && !task.isCompleted) return false;
      if (statusFilter === "incomplete" && task.isCompleted) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDateAsc":
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "dueDateDesc":
          return new Date(b.dueDate) - new Date(a.dueDate);
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          return a.isCompleted - b.isCompleted;
        default:
          return 0;
      }
    });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Dashboard</h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        <p
          onClick={() => navigate("/profile")}
          className="text-blue-600 hover:underline cursor-pointer text-sm mb-6"
        >
          View User Info
        </p>

        <form onSubmit={handleAddTask} className="mb-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Add Task</h3>
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="datetime-local"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add Task
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>

        {/* Filter and sort */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            placeholder="Filter by Date"
          />
          <input
            type="datetime-local"
            value={rangeFrom}
            onChange={(e) => setRangeFrom(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            placeholder="From"
          />
          <input
            type="datetime-local"
            value={rangeTo}
            onChange={(e) => setRangeTo(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            placeholder="To"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="all">All Tasks</option>
            <option value="completed">Only Completed</option>
            <option value="incomplete">Only Incomplete</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="dueDateAsc">Sort by Due Date ↑</option>
            <option value="dueDateDesc">Sort by Due Date ↓</option>
            <option value="title">Sort by Title</option>
            <option value="status">Sort by Status</option>
          </select>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            Reset Filters
          </button>
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Tasks</h3>
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : (
          <ul className="space-y-4">
            {currentTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                token={token}
                today={today}
                onUpdate={(id, updatedTask) =>
                  setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)))
                }
                onDelete={handleDelete}
              />
            ))}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of{" "}
                {Math.ceil(filteredTasks.length / tasksPerPage)}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < Math.ceil(filteredTasks.length / tasksPerPage)
                      ? prev + 1
                      : prev,
                  )
                }
                disabled={
                  currentPage === Math.ceil(filteredTasks.length / tasksPerPage)
                }
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
