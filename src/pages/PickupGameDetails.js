import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const PickupGameDetails = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [activeTab, setActiveTab] = useState("gameInfo");
  const [user, setUser] = useState(null);
  const [showJoinForm, setShowJoinForm] = useState(false); // Toggle form visibility
  const [loading, setLoading] = useState(false);

  // Fetch authenticated user
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
  }, []);

  // Fetch game details
  useEffect(() => {
    const fetchGameDetails = async () => {
      console.log("Fetching game details for ID:", gameId);

      if (!gameId) {
        console.error("gameId is missing!");
        return;
      }

      try {
        const gameRef = doc(db, "pickupGames", gameId);
        const gameSnap = await getDoc(gameRef);

        if (gameSnap.exists()) {
          console.log("Game data:", gameSnap.data());
          setGame({
            ...gameSnap.data(),
            players: Array.isArray(gameSnap.data().players) ? gameSnap.data().players : [],
          });
        } else {
          console.log("No such game found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  const joinGame = async (username, phone, position) => {
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
      setShowJoinForm(false);
    } catch (error) {
      console.error("❌ Error joining game:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!game) return <div className="text-center text-gray-600 mt-5">Loading game details...</div>;

  return (
    <div className="relative flex flex-col lg:flex-row justify-between gap-6 max-w-6xl mx-auto mt-12 bg-gray-900 text-gray-200">
      {/* Game Details Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex-grow lg:w-2/3">
        {/* Back to Games Arrow */}
        <button onClick={() => navigate("/pickup-soccer")} className="flex items-center text-gray-200 hover:text-blue-500 transition mb-4">
          <span className="text-xl">←</span> <span className="ml-2 font-medium">Back to Games</span>
        </button>

        {/* Field Location */}
        <h1 className="text-3xl font-bold mb-4 text-left text-white">{game.location}</h1>

        {/* Larger Image */}
        {game.imageURL && (
          <img src={game.imageURL} alt="Game preview" className="w-full h-96 object-cover rounded-lg mb-6 shadow-md" />
        )}

        {/* Modern Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          {["gameInfo", "players", "otherInfo"].map((tab) => (
            <button
              key={tab}
              className={`relative px-6 py-2 rounded-md text-sm font-semibold transition-all duration-300
                ${activeTab === tab ? "bg-blue-600 text-white shadow-md" : "bg-gray-700 text-gray-300"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "gameInfo" ? "Game Info" : tab === "players" ? "Players" : "Other Info"}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-sm">
          {activeTab === "gameInfo" && (
            <>
              <h3 className="text-xl font-semibold text-gray-200 mb-4">Game Information</h3>
              <p><strong>Date:</strong> {game.date}</p>
              <p><strong>Start Time:</strong> {game.startTime}</p>
              <p><strong>Game Size:</strong> {game.gameSize}</p>
            </>
          )}

          {activeTab === "players" && (
            <>
              <h3 className="text-xl font-semibold text-gray-200 mb-4">Attending Players</h3>
              <div className="max-h-52 overflow-y-auto bg-gray-700 p-4 rounded-md shadow-sm">
                {game.players.length > 0 ? (
                  game.players.map((player, index) => (
                    <p key={index} className="border-b border-gray-500 py-2">
                      <strong>{player.username}</strong> - {player.position} - {player.phone}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400">No players attending yet.</p>
                )}
              </div>
            </>
          )}

          {activeTab === "otherInfo" && (
            <>
              <h3 className="text-xl font-semibold text-gray-200 mb-4">Other Information</h3>
              <p><strong>Additional Info:</strong> {game.additionalInfo || "No additional information."}</p>
            </>
          )}
        </div>

        {/* Join Now Button */}
        {/* Join Now Button */}
<div className="mt-6 text-center">
  {user ? (
    <button
      onClick={() => setShowJoinForm((prev) => !prev)}
      className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
    >
      {showJoinForm ? "Close Form" : "Join Now"}
    </button>
  ) : (
    <p className="text-red-400">⚠️ Please log in to join this game.</p>
  )}
</div>

{/* Join Request Form */}
{user && showJoinForm && (
  <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-lg">
    <h3 className="text-xl font-bold text-gray-200">Join the Game</h3>

    <div className="mt-4 space-y-4">
      <div>
        <label className="text-sm font-semibold text-gray-300">Your Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded bg-gray-100 focus:bg-white"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-300">Phone Number</label>
        <input
          type="text"
          className="w-full p-2 border rounded bg-gray-100 focus:bg-white"
          placeholder="Enter your phone number"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-300">Position</label>
        <select
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
  </div>
)}

      </div>
    </div>
  );
};

export default PickupGameDetails;
