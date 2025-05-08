import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { motion, useSpring, useTransform, useScroll } from "framer-motion";

const JoinRequestCard = ({ onClose, gameId, user, hostUsername }) => {
  const [username, setUsername] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);
  const smoothY = useSpring(y, { stiffness: 80, damping: 20 });

  const formatPhoneNumber = (input) => {
    const cleaned = input.replace(/\D/g, "").slice(0, 10);
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : cleaned;
  };

  const joinGame = async () => {
    if (!username.trim() || !phone.trim() || !position) {
      alert("⚠️ Please fill out all fields!");
      return;
    }

    setLoading(true);
    try {
      const gameRef = doc(db, "pickupGames", gameId);
      const gameSnap = await getDoc(gameRef);

      if (!gameSnap.exists()) {
        alert("❌ Game not found!");
        setLoading(false);
        return;
      }

      const gameData = gameSnap.data();
      const currentPlayers = Array.isArray(gameData.players) ? gameData.players : [];

      await updateDoc(gameRef, {
        players: [...currentPlayers, { username, phone, position }],
      });

      alert("✅ You have joined the game!");
      onClose();
    } catch (error) {
      console.error("❌ Error joining game:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      style={isMobile ? {} : { y: smoothY }}
      className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 border mx-auto mt-6"
    >
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Hosted By: {hostUsername || "Unknown"}</h2>
      </div>

      {!user ? (
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Want to Join?</h2>
          <p className="text-gray-600">Please log in to request to join this game.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Log In
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold text-gray-800">Join the Game</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Your Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded bg-gray-100 focus:bg-white"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                className="w-full p-2 border rounded bg-gray-100 focus:bg-white"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full p-2 border rounded bg-gray-100 focus:bg-white"
              >
                <option value="" disabled>Select your position</option>
                <option value="Forward">Forward</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Defender">Defender</option>
                <option value="Goalkeeper">Goalkeeper</option>
              </select>
            </div>

            <button
              onClick={joinGame}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Joining..." : "Join Game"}
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default JoinRequestCard;
