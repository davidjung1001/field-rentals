import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import JoinRequestCard from "../components/JoinRequestCard";

const PickupGameDetails = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [activeTab, setActiveTab] = useState("gameInfo");
  const [user, setUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
      console.log("Fetching game details for ID:", gameId); // 🔹 Debugging log

      if (!gameId) {
        console.error("gameId is missing!");
        return;
      }

      try {
        const gameRef = doc(db, "pickupGames", gameId);
        const gameSnap = await getDoc(gameRef);

        if (gameSnap.exists()) {
          console.log("Game data:", gameSnap.data()); // 🔹 Debugging log
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

    fetchGameDetails(); // 🔹 Ensure function is called

  }, [gameId]);

  // Confirm delete
  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Delete the game from Firestore
      await deleteDoc(doc(db, "pickupGames", gameId));
      setShowConfirmModal(false);
      navigate("/pickup-soccer"); // Navigate after deleting
    } catch (error) {
      console.error("Error deleting game:", error);
      setShowConfirmModal(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  if (!game) return <div className="text-center text-gray-600 mt-5">Loading game details...</div>;

  return (
    <div className="relative flex flex-col lg:flex-row justify-between gap-6 max-w-6xl mx-auto mt-12">
      {/* Game Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex-grow lg:w-2/3">
        
        {/* Back to Games Arrow */}
        <button onClick={() => navigate("/pickup-soccer")} className="flex items-center text-gray-700 hover:text-blue-600 transition mb-4">
          <span className="text-xl">←</span> <span className="ml-2 font-medium">Back to Games</span>
        </button>

        {/* Field Location (Top Left in Black) */}
        <h1 className="text-3xl font-bold mb-4 text-left text-black">{game.location}</h1>

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
                ${activeTab === tab ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "gameInfo" ? "Game Info" : tab === "players" ? "Players" : "Other Info"}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
          {activeTab === "gameInfo" && (
            <>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Game Information</h3>
              <p><strong>Date:</strong> {game.date}</p>
              <p><strong>Start Time:</strong> {game.startTime}</p>
              <p><strong>Game Size:</strong> {game.gameSize}</p>
            </>
          )}

          {activeTab === "players" && (
            <>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Attending Players</h3>
              <div className="max-h-52 overflow-y-auto bg-white p-4 rounded-md shadow-sm">
              {game.players.length > 0 ? (
  game.players.map((player, index) => (
    <p key={index} className="border-b border-gray-300 py-2">
      <strong>{player.username}</strong> - {player.position} - {player.phone}
    </p>
  ))
) : (
  <p className="text-gray-500">No players attending yet.</p>
)}
              </div>
            </>
          )}

          {activeTab === "otherInfo" && (
            <>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Other Information</h3>
              <p><strong>Additional Info:</strong> {game.additionalInfo || "No additional information."}</p>
              {user && user.uid === game.hostId && (
                <button
                  onClick={handleDeleteClick}
                  className="bg-red-600 text-white px-4 py-2 rounded mt-4 hover:bg-red-700 transition"
                >
                  Delete Field
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Join Request Card (Right Side) */}
      <div className="relative w-80">
      <JoinRequestCard gameId={game?.gameId} user={user} hostUsername={game?.hostUsername} />
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="mb-4">Are you sure you want to delete this game?</p>
            <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded mr-2">Yes</button>
            <button onClick={cancelDelete} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PickupGameDetails;
