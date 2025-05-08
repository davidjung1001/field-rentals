import { useState, useEffect } from "react";
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { db, auth } from "../firebaseConfig";
import ImageUpload from "../components/ImageUpload"; // Update path if needed

const HostPickupGame = () => {
  const [user, setUser] = useState(null);
  const [imageError, setImageError] = useState("");
  const [fieldType, setFieldType] = useState("public");

  const [newGame, setNewGame] = useState({
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    gameSize: "5v5",
    maxPlayers: 10,
    price: "Free",
    imageURL: "",
    players: [],
    hostUsername: "",
    phone: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setNewGame((prev) => ({
            ...prev,
            hostUsername: userSnap.data().username || "Unknown Host",
            phone: userSnap.data().phone || "",
          }));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCreateGame = async () => {
    if (!user?.uid) {
      alert("❌ You must be logged in to host a game.");
      return;
    }

    const { location, date, startTime, endTime, price, imageURL } = newGame;
    if (!location || !date || !startTime || !endTime || !price) {
      alert("⚠️ Please fill out all required fields.");
      return;
    }

    try {
      const gameToCreate = {
        ...newGame,
        players: [
          {
            username: newGame.hostUsername || "Host",
            phone: newGame.phone || "N/A",
            position: "Host",
          },
        ],
        hostId: user.uid,
        fieldType,
        createdAt: new Date(),
      };

      const gameRef = await addDoc(collection(db, "pickupGames"), gameToCreate);
      await updateDoc(gameRef, { gameId: gameRef.id });
      await updateDoc(doc(db, "users", user.uid), {
        hostedGames: arrayUnion(gameRef.id),
      });

      navigate("/pickup-soccer");
    } catch (error) {
      console.error("❌ Error hosting game:", error);
    }
  };

  return (
    <div className="bg-white text-gray-800 p-6 md:p-10 rounded-3xl shadow-2xl max-w-5xl mx-auto mt-12">
      <h2 className="text-3xl font-bold text-center mb-6">Host a Pickup Game</h2>

      <label className="block font-semibold mt-4">Field Type</label>
      <select
        value={fieldType}
        onChange={(e) => {
          const type = e.target.value;
          setFieldType(type);
          setNewGame({ ...newGame, price: type === "public" ? "Free" : "" });
        }}
        className="p-3 bg-gray-100 rounded w-full mt-2"
      >
        <option value="public">Public Field (Free)</option>
        <option value="reserved">Reserved Field (Enter Price)</option>
      </select>

      <label className="block font-semibold mt-4">Game Location</label>
      <input
        type="text"
        value={newGame.location}
        onChange={(e) => setNewGame({ ...newGame, location: e.target.value })}
        className="p-3 bg-gray-100 rounded w-full mt-2"
        placeholder="E.g., Downtown Soccer Park"
      />

      <label className="block font-semibold mt-4">Game Date</label>
      <input
        type="date"
        value={newGame.date}
        onChange={(e) => setNewGame({ ...newGame, date: e.target.value })}
        className="p-3 bg-gray-100 rounded w-full mt-2"
      />

      <label className="block font-semibold mt-4">Start Time</label>
      <TimePicker
        value={newGame.startTime}
        onChange={(time) => setNewGame({ ...newGame, startTime: time })}
        className="p-3 rounded w-full mt-2"
        disableClock
      />

      <label className="block font-semibold mt-4">End Time</label>
      <TimePicker
        value={newGame.endTime}
        onChange={(time) => setNewGame({ ...newGame, endTime: time })}
        className="p-3 rounded w-full mt-2"
        disableClock
      />

      <label className="block font-semibold mt-4">Game Size</label>
      <select
        value={newGame.gameSize}
        onChange={(e) => setNewGame({ ...newGame, gameSize: e.target.value })}
        className="p-3 bg-gray-100 rounded w-full mt-2"
      >
        <option value="5v5">5v5</option>
        <option value="7v7">7v7</option>
        <option value="11v11">11v11</option>
      </select>

      <label className="block font-semibold mt-4">Max Players</label>
      <input
        type="number"
        value={newGame.maxPlayers}
        onChange={(e) =>
          setNewGame({ ...newGame, maxPlayers: parseInt(e.target.value) })
        }
        className="p-3 bg-gray-100 rounded w-full mt-2"
        placeholder="E.g., 10"
      />

      <label className="block font-semibold mt-4">Price</label>
      <input
        type="text"
        value={newGame.price}
        disabled={fieldType === "public"}
        onChange={(e) => setNewGame({ ...newGame, price: e.target.value })}
        className={`p-3 rounded w-full mt-2 ${
          fieldType === "public"
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gray-100"
        }`}
        placeholder={fieldType === "public" ? "Free" : "Enter price per person"}
      />

      <label className="block font-semibold mt-4">Upload Image</label>
      <ImageUpload
        setImageURLs={(urls) =>
          setNewGame((prev) => ({ ...prev, imageURL: urls[0] || "" }))
        }
      />
      {imageError && (
        <p className="text-red-500 text-sm mt-1">{imageError}</p>
      )}

      {newGame.imageURL && (
        <div className="mt-4">
          <img
            src={newGame.imageURL}
            alt="Uploaded preview"
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      <button
        onClick={handleCreateGame}
        className="bg-green-600 text-white px-6 py-3 rounded mt-6 w-full hover:bg-green-700 transition"
      >
        Host Game
      </button>
    </div>
  );
};

export default HostPickupGame;
