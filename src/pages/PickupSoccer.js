import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import PickupGameCard from "../components/PickupGameCard";
import { Link } from "react-router-dom";
import PickupChat from "../components/PickupChat";

const PickupSoccer = () => {
  const [games, setGames] = useState([]);
  const [fields, setFields] = useState([]);
  const [visibleSection, setVisibleSection] = useState(null); // Track which section is visible

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
    const handleScroll = () => {
      const sections = document.querySelectorAll(".scroll-section");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        // ✅ Track visibility smoothly until fully visible
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setVisibleSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-16 space-y-24"> {/* ✅ Increased spacing */}
      
      {/* ✅ Pickup Games Section */}
      <section id="pickupGames" className={`scroll-section bg-white p-8 rounded-3xl shadow-lg transition-all duration-500 ${visibleSection === "pickupGames" ? "scale-105" : "scale-100"} min-h-[250px]`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Join a Pickup Game</h2>
          <Link to="/host-pickup-game" className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg shadow hover:bg-blue-700 transition">
            Host a Game
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {games.length > 0 ? (
            games.map((game) => <PickupGameCard key={game.id} game={game} />)
          ) : (
            <p className="text-gray-500 text-center col-span-full">No pickup games available.</p>
          )}
        </div>
      </section>

      

      {/* ✅ Organize a Pickup Section */}
      <section
  id="chatRoom"
  className={`scroll-section bg-white p-8 rounded-3xl shadow-lg transition-all duration-500 ${
    visibleSection === "chatRoom" ? "scale-105" : "scale-100"
  }`}
>
  <h2 className="text-3xl font-bold text-purple-600 mb-6">Get Involved in the Community</h2>
  <p className="text-gray-600 mb-4">Chat with local players and organize games.</p>

  {/* ✅ Chat Preview */}
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-inner mb-4">
    <div className="text-sm text-gray-700 space-y-2 max-h-32 overflow-y-auto">
      <p><span className="font-semibold">Leo:</span> Anyone playing at Riverside tonight?</p>
      <p><span className="font-semibold">Jenna:</span> I’m down for 7pm, 6v6 max?</p>
      <p><span className="font-semibold">Mark:</span> I’ll bring a ball.</p>
    </div>
  </div>

  <Link
    to="/pickup-chat"
    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
  >
    Join the Chat
  </Link>
</section>


    </div>
  );
};

export default PickupSoccer;