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
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-12">
      <h2 className="text-3xl font-bold text-center mb-8">📋 Your Listed Fields</h2>

      {loading ? (
        <p className="text-blue-500 text-center">Loading listings...</p>
      ) : listings.length === 0 ? (
        <p className="text-gray-500 text-center">⚠️ No fields listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {listings.map(field => (
            <div key={field.id} className="p-6 border border-gray-300 rounded-lg shadow-md bg-gray-50">
              {/* Profile Picture */}
              {field.images?.length > 0 ? (
                <img
                  src={field.images[0]}
                  alt={field.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-600">No image available</span>
                </div>
              )}

              <h3 className="text-xl font-semibold mb-2">{field.name}</h3>
              <p className="text-gray-600">📍 {field.location}</p>
              <p className="text-gray-600">💲 {field.price_per_hour}/hour</p>

              <div className="mt-4 flex justify-between space-x-4">
                {/* Edit Button */}
                <button
                  onClick={() => navigate(`/edit-field/${field.id}`)}
                  className="w-full md:w-auto bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                >
                  ✏️ Edit Field
                </button>
                
                {/* Delete Button */}
                <button
                  onClick={() => {} /* handle delete logic here */}
                  className="w-full md:w-auto bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                >
                  ❌ Delete Field
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileListings;
