import { FaTrash } from "react-icons/fa";
import axios from "axios";
import PropTypes from "prop-types";

const toLocalDatetime = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

function TaskItem({ task, token, onUpdate, onDelete, today }) {
  const handleCheckboxChange = async () => {
    const updated = await axios.put(
      `http://localhost:5000/api/tasks/${task._id}`,
      { isCompleted: !task.isCompleted },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    onUpdate(task._id, updated.data);
  };

  const handleTitleChange = async (e) => {
    const updated = await axios.put(
      `http://localhost:5000/api/tasks/${task._id}`,
      { title: e.target.value },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    onUpdate(task._id, updated.data);
  };

  const handleDateChange = async (e) => {
    const updated = await axios.put(
      `http://localhost:5000/api/tasks/${task._id}`,
      { dueDate: e.target.value },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    onUpdate(task._id, updated.data);
  };

  return (
    <li
      className={`p-4 rounded-lg shadow-sm border ${
        toLocalDatetime(task.dueDate).split("T")[0] === today
          ? "bg-yellow-100"
          : "bg-gray-50"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={handleCheckboxChange}
          />
          <input
            type="text"
            value={task.title}
            className={`bg-transparent border-none focus:ring-0 ${
              task.isCompleted ? "line-through text-gray-400" : "text-gray-800"
            }`}
            onChange={handleTitleChange}
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="datetime-local"
            value={toLocalDatetime(task.dueDate)}
            onChange={handleDateChange}
            className="p-2 border border-gray-300 rounded"
          />
          <button
            onClick={() => onDelete(task._id)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </li>
  );
}

TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  today: PropTypes.string.isRequired,
};

export default TaskItem;
