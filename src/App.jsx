import "./index.css";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
          Login
        </h2>

        <form className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-sm text-center">
          Don’t have an account?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;
