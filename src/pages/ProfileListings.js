import { useState, useEffect } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const ProfileListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserListings = async () => {
      setLoading(true);
      if (!auth.currentUser) return;

      try {
        const q = query(collection(db, "soccerFields"), where("hostId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);

        const listingsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setListings(listingsArray);
      } catch (error) {
        console.error("❌ Error fetching listings:", error);
      }
      setLoading(false);
    };

    fetchUserListings();
  }, []);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">📋 Your Listed Fields</h2>

      {loading ? (
        <p className="text-blue-500">Loading listings...</p>
      ) : listings.length === 0 ? (
        <p className="text-gray-500">⚠️ No fields listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {listings.map(field => (
            <div key={field.id} className="p-4 border rounded-lg shadow-md">
              {/* ✅ Display field image */}
              {field.images?.length > 0 ? (
                <img src={field.images[0]} alt={field.name} className="w-full h-32 object-cover rounded-lg mb-2" />
              ) : (
                <p className="text-gray-500">No image available</p>
              )}

              <h3 className="text-lg font-bold">{field.name}</h3>
              <p className="text-gray-600">📍 {field.location}</p>
              <p className="text-gray-600">💲 {field.price_per_hour}/hour</p>

              {/* ✅ Edit link */}
              <button 
                onClick={() => navigate(`/edit-field/${field.id}`)}
                className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              >
                ✏️ Edit Field
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileListings;