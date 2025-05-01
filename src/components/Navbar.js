import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Soccer Field Rentals</h1>

      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/add-field" className="hover:underline">Add a Field</Link>
        
        {/* ✅ Login Button */}
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;