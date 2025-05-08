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
    <nav className="fixed top-0 left-0 w-full bg-gray-100 shadow-md p-2 sm:p-4 z-[1000]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-3 sm:px-6">
        {/* Logo/Title */}
        <Link
          to="/"
          className="text-lg sm:text-xl font-bold text-gray-800 hover:opacity-80 transition"
        >
          UltimateField
        </Link>

        {/* Hamburger Icon */}
        <button className="block lg:hidden" onClick={toggleMenu}>
          <FaBars size={22} className="text-gray-800" />
        </button>

        {/* Desktop Right-side Buttons */}
        <div className="hidden lg:flex items-center gap-6">
          {user ? (
            <>
              

              <div className="relative dropdown-container">
                <button
                  className="flex items-center text-gray-800 text-sm font-semibold hover:opacity-80 transition"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <FaUserCircle size={24} className="mr-1" />
                  <span>{username || "Guest"}</span>
                  <FaChevronDown
                    className={`ml-1 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2 text-sm">
                    <Link
                      to={`/profile/${username}`}
                      className="block w-full text-left px-3 py-1 hover:bg-gray-200"
                    >
                      View My Listings
                    </Link>
                    
                    <Link
                      to="/pickup-soccer"
                      className="block w-full text-left px-3 py-1 hover:bg-gray-200"
                      >
                      Pick Up 
                      </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-1 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/add-field"
                className="text-gray-800 text-sm font-semibold hover:opacity-80 transition"
              >
                <FaPlus size={16} className="inline-block mr-1" />
                Add Field
              </Link>

              <div className="relative dropdown-container">
                <button
                  className="flex items-center text-gray-800 text-sm font-semibold hover:opacity-80 transition"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <FaUserCircle size={24} />
                  <FaChevronDown
                    className={`ml-1 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md p-2 text-sm">
                    <button
                      onClick={() => navigate("/login")}
                      className="block w-full text-left px-3 py-1 hover:bg-gray-200"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="block w-full text-left px-3 py-1 hover:bg-gray-200"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`lg:hidden ${isMenuOpen ? "block" : "hidden"} mt-3 px-4`}>
        <div className="flex flex-col gap-3 text-sm">
          {user ? (
            <>
              <Link
                to="/add-field"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-800 font-medium hover:opacity-80 transition"
              >
                <FaPlus className="inline-block mr-1" />
                Add Field
              </Link>
              <Link
                to={`/profile/${username}`}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-800 font-medium hover:opacity-80 transition"
              >
                View My Listings
              </Link>
              <Link
                to="/my-bookings"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-800 font-medium hover:opacity-80 transition"
              >
                My Bookings
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-800 font-medium hover:opacity-80 transition text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/add-field"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-800 font-medium hover:opacity-80 transition"
              >
                <FaPlus className="inline-block mr-1" />
                Add Field
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/login");
                }}
                className="text-gray-800 font-medium hover:opacity-80 transition text-left"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/register");
                }}
                className="text-gray-800 font-medium hover:opacity-80 transition text-left"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
