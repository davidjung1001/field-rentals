import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { FaUserCircle, FaPlus, FaChevronDown, FaBars } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUsername(userSnap.data().username || "User");
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      } else {
        setUser(null);
        setUsername("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      setUsername("");
      setIsDropdownOpen(false);
      setIsMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm border-b z-[1000]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-2">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-gray-800 hover:opacity-80 transition"
        >
          UltimateField
        </Link>

        {/* Hamburger */}
        <button className="block lg:hidden" onClick={toggleMenu}>
          <FaBars size={22} className="text-gray-800" />
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
          {user ? (
            <>
              <Link to="/pickup-soccer" className="hover:text-blue-600 transition">Play</Link>
              <Link to="/pickup-chat" className="hover:text-blue-600 transition">Threads</Link>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center hover:text-blue-600 transition"
                >
                  <FaUserCircle size={22} className="mr-1" />
                  {username}
                  <FaChevronDown
                    className={`ml-1 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-md text-sm">
                    <Link
                      to="/my-bookings"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Games
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/add-field" className="flex items-center hover:text-blue-600 transition">
                <FaPlus size={14} className="mr-1" /> Add Field
              </Link>
              <button
                onClick={() => navigate("/login")}
                className="hover:text-blue-600 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="hover:text-blue-600 transition"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div className={`lg:hidden ${isMenuOpen ? "block" : "hidden"} px-4 pb-4`}>
        <div className="flex flex-col gap-3 text-sm text-gray-700 font-medium">
          {user ? (
            <>
              <Link to="/pickup-soccer" onClick={() => setIsMenuOpen(false)}>Play</Link>
              <Link to="/pickup-chat" onClick={() => setIsMenuOpen(false)}>Threads</Link>
              <Link to="/my-bookings" onClick={() => setIsMenuOpen(false)}>My Games</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/add-field" onClick={() => setIsMenuOpen(false)}>
                <FaPlus size={14} className="inline mr-1" /> Add Field
              </Link>
              <button onClick={() => { setIsMenuOpen(false); navigate("/login"); }}>Login</button>
              <button onClick={() => { setIsMenuOpen(false); navigate("/register"); }}>Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
