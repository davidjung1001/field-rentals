import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const JoinRequestCard = ({ onClose, gameId, user, hostUsername }) => {
  const [username, setUsername] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100); // ✅ Delayed fade-in effect
  }, []);

  // ✅ Auto-format phone number for better input handling
  const formatPhoneNumber = (input) => {
    const cleaned = input.replace(/\D/g, "").slice(0, 10);
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : cleaned;
  };

  // ✅ Function to handle joining the game
  const joinGame = async () => {
    console.log("🔥 Received gameId in JoinRequestCard:", gameId);
    if (!username.trim() || !phone.trim() || !position) {
      alert("⚠️ Please fill out all fields!");
      return;
    }

    setLoading(true);

    try {
      const gameRef = doc(db, "pickupGames", gameId);
      console.log("🔥 Attempting to join game with ID:", gameId);

      const gameSnap = await getDoc(gameRef);

      if (!gameSnap.exists()) {
        alert("❌ Game not found!");
        setLoading(false);
        return;
      }

      const gameData = gameSnap.data();
      console.log("🔥 Game Data Before Update:", gameData);

      const currentPlayers = Array.isArray(gameData.players) ? gameData.players : [];

      console.log("🔥 Current Players Before Update:", currentPlayers);

      await updateDoc(gameRef, {
        players: [...currentPlayers, { username, phone, position }],
      });

      console.log("✅ Successfully updated players!");

      const updatedGameSnap = await getDoc(gameRef);
      console.log("🔥 Updated Players After Update:", updatedGameSnap.data().players);

      alert("✅ You have joined the game!");
      onClose();
    } catch (error) {
      console.error("❌ Error joining game:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed top-32 right-8 w-80 bg-white shadow-lg rounded-lg p-5 border overflow-y-auto max-h-[80vh] transition-all duration-500 ease-in-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-20px]"}`}
    >
      
      {/* Hosted By Section */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Hosted By: {hostUsername || "Unknown"}</h2>
      </div>

      <h2 className="text-xl font-bold text-gray-800">Join the Game</h2>

      {!user ? (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md mb-4">
          <p>Please log in to join the game.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          >
            Log In
          </button>
        </div>
      ) : (
        <>
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
          <button
            onClick={onClose}
            className="mt-2 w-full bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </>
      )}

    </div>
  );
};

export default JoinRequestCard;