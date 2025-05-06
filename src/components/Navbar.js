import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { FaUserCircle, FaPlus, FaChevronDown } from "react-icons/fa"; // ✅ Arrow icon

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUsername(userSnap.data().username || "User");
            console.log("✅ Fetched Username:", userSnap.data().username);
          } else {
            console.warn("⚠️ No user found in Firestore.");
          }
        } catch (error) {
          console.error("❌ Error fetching username:", error);
        }
      } else {
        setUser(null);
        setUsername("");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) { // ✅ Detect clicks outside
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside); // ✅ Listen for outside clicks
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      setUsername("");
      setIsDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-100 shadow-md p-4 z-[1000]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        {/* ✅ Clickable Title */}
        <Link to="/" className="text-xl font-bold text-gray-800 hover:opacity-80 transition">
          ⚽ Rent a Field
        </Link>

        {/* ✅ User & Add Field Section (Right Aligned) */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* ✅ Add Field Button */}
              <Link to="/add-field" className="text-gray-800 text-sm font-semibold hover:opacity-80 transition">
                <FaPlus size={16} className="inline-block mr-1" />
                Add Field
              </Link>

              {/* ✅ Profile Dropdown */}
              <div className="relative dropdown-container"> {/* ✅ Added class */}
                <button 
                  className="flex items-center text-gray-800 text-sm font-semibold hover:opacity-80 transition"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <FaUserCircle size={28} className="mr-2" />
                  <span className="text-lg font-bold">{username || "Guest"}</span> 
                  <FaChevronDown 
                    className={`ml-2 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} // ✅ Arrow rotates when dropdown opens
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
                      to="/my-bookings" 
                      className="block w-full text-left px-3 py-1 hover:bg-gray-200"
                    >
                      My Bookings
                    </Link> {/* ✅ Added "My Bookings" */}
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
              {/* ✅ Add Field for Guests */}
              <Link to="/add-field" className="text-gray-800 text-sm font-semibold hover:opacity-80 transition">
                <FaPlus size={16} className="inline-block mr-1" />
                Add Field
              </Link>

              {/* ✅ Profile Dropdown for Guests */}
              <div className="relative dropdown-container"> {/* ✅ Added class */}
                <button 
                  className="flex items-center text-gray-800 text-sm font-semibold hover:opacity-80 transition"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <FaUserCircle size={28} />
                  <FaChevronDown 
                    className={`ml-2 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} // ✅ Arrow rotates
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
    </nav>
  );
};

export default Navbar;