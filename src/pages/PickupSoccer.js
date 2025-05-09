import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import PickupGameCard from "../components/PickupGameCard";
import YouthTryoutCard from "../components/YouthTryoutCard"; // Import your YouthTryoutCard component
import { Link } from "react-router-dom";

const PickupSoccer = () => {
  const [games, setGames] = useState([]);
  const [fields, setFields] = useState([]);
  const [tryouts, setTryouts] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const querySnapshot = await getDocs(collection(db, "pickupGames"));
      setGames(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchGames();
  }, []);

  useEffect(() => {
    const fetchFields = async () => {
      const querySnapshot = await getDocs(collection(db, "freeFields"));
      setFields(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchFields();
  }, []);

  useEffect(() => {
    const fetchTryouts = async () => {
      const snapshot = await getDocs(collection(db, "youthTryouts"));
      setTryouts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchTryouts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-16 space-y-24 px-4 sm:px-6 md:px-8">
      
      {/* Pickup Games Section */}
      <section id="pickupGames" className="bg-gray-800 p-6 rounded-3xl shadow-lg transition hover:shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Play Now</h2>
          <div className="space-x-2">
            <Link to="/explore-pickup-games" className="bg-white text-gray-800 px-4 py-2 text-sm rounded-lg shadow hover:bg-gray-200 transition">View More</Link>
            <Link to="/host-pickup-game" className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg shadow hover:bg-blue-700 transition">Add Game</Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {games.length > 0 ? games.map((game) => <PickupGameCard key={game.id} game={game} />) : <p className="text-gray-300 text-center col-span-full">No pickup games available.</p>}
        </div>
      </section>

      {/* Community Chat Section */}
      <section id="chatRoom" className="bg-gray-800 p-6 rounded-3xl shadow-lg transition hover:shadow-xl text-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Get Involved in the Community</h2>
        <p className="text-gray-300 mb-4">Chat with local players and organize games.</p>
        <div className="bg-zinc-700 border border-zinc-600 rounded-lg p-4 shadow-inner mb-4">
          <div className="text-sm text-gray-300 space-y-2 max-h-32 overflow-y-auto">
            <p><span className="font-semibold text-white">Leo:</span> Hala Madrid! </p>
            <p><span className="font-semibold text-white">Jenna:</span> I’m down for 7pm, 6v6 max?</p>
            <p><span className="font-semibold text-white">Mark:</span> I’ll bring a ball.</p>
          </div>
        </div>
        <Link to="/pickup-chat" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">Visit Threads</Link>
      </section>

      {/* Youth Tryouts Section */}
      <section id="youthTryouts" className="bg-gray-800 p-6 rounded-3xl shadow-lg transition hover:shadow-xl text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Tryouts Near You</h2>
          <div className="space-x-2">
            <Link to="/youth-tryouts" className="bg-white text-zinc-900 px-4 py-2 text-sm rounded-lg shadow hover:bg-zinc-200 transition">View All</Link>
            <Link to="/post-tryout" className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg shadow hover:bg-blue-700 transition">Post Tryout</Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tryouts.length > 0 ? (
            tryouts.map((tryout) => (
              <YouthTryoutCard key={tryout.id} tryout={tryout} /> // Use your YouthTryoutCard here
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-full">No tryouts posted yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default PickupSoccer;
