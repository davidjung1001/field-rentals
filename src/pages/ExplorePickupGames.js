import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import PickupGameCard from "../components/PickupGameCard";
import { Link } from "react-router-dom";

const ExplorePickupGames = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const snapshot = await getDocs(collection(db, "pickupGames"));
      setGames(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchGames();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto p-6 mt-12 bg-gray-800 rounded-3xl shadow-lg">
        {/* Back Arrow */}
        <Link to="/" className="text-purple-500 flex items-center space-x-2 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-semibold">Back to Sections</span>
        </Link>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Explore Pickup Games</h1>

        {/* Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {games.length > 0 ? (
            games.map((game) => <PickupGameCard key={game.id} game={game} />)
          ) : (
            <p className="text-gray-500 col-span-full text-center">No games available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePickupGames;
