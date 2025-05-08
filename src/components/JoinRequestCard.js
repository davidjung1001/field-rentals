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

  // Detect screen width on mount
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll animation only if not mobile
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);
  const smoothY = useSpring(y, { stiffness: 80, damping: 20 });

  if (!user) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🚀 Access Restricted</h2>
        <p className="text-gray-600 mb-6">
          You must be logged in to view fields and join games.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
        >
          Log In Now
        </button>
      </div>
    );
  }

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
      className="w-full max-w-md bg-white shadow-lg rounded-lg p-5 border overflow-y-auto max-h-[80vh] mt-6 mx-auto"
    >
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Hosted By: {hostUsername || "Unknown"}</h2>
      </div>

      <h2 className="text-xl font-bold text-gray-800">Join the Game</h2>

      <div className="mt-4">
        <label className="text-sm font-semibold text-gray-700">Your Name</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded bg-gray-100 focus:bg-white"
          placeholder="Enter your name"
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-semibold text-gray-700">Phone Number</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
          className="w-full p-2 border rounded bg-gray-100 focus:bg-white"
          placeholder="Enter your phone number"
        />
      </div>

      <div className="mt-4">
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
        className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? "Joining..." : "Join Game"}
      </button>
    </motion.div>
  );
};

export default JoinRequestCard;
