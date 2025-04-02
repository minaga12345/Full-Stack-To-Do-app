import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/login");

    axios
      .get("http://localhost:5000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate, token]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          User Profile
        </h2>
        <p className="text-gray-700 mb-2">
          <strong>User ID:</strong> {user?.userId}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Email:</strong> {user?.email}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Name:</strong> {user?.name}
        </p>

        <button
          onClick={() => navigate("/change-password")}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Change Password
        </button>

        <p className="mt-4 text-sm text-center">
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </span>
        </p>
      </div>
    </div>
  );
}

export default UserProfile;
