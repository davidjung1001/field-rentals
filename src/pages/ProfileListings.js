import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const ProfileListings = () => {
  const { userId } = useParams();
  const [listings, setListings] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUid, setCurrentUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUid(user.uid);

        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserInfo(userSnap.data());
            console.log("✅ Fetched User Info:", userSnap.data());
          } else {
            console.warn("⚠️ No user found in Firestore.");
          }
        } catch (error) {
          console.error("❌ Error fetching user info:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      if (!currentUid) return;

      try {
        console.log("Fetching listings for user UID:", currentUid);

        const q = query(collection(db, "soccerFields"), where("hostId", "==", currentUid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No listings found for this user.");
        }

        const fetchedListings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched Listings:", fetchedListings);
        setListings(fetchedListings);
      } catch (error) {
        console.error("❌ Error fetching user listings:", error);
      }

      setLoading(false);
    };

    if (currentUid) fetchListings();
  }, [currentUid]);

  // ✅ Delete Listing Function
  const handleDelete = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      await deleteDoc(doc(db, "soccerFields", listingId));
      setListings(listings.filter(listing => listing.id !== listingId)); // ✅ Remove from UI
      console.log("✅ Listing deleted:", listingId);
    } catch (error) {
      console.error("❌ Error deleting listing:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2 className="text-3xl font-bold">{userInfo ? `${userInfo.username}'s Listings` : "Profile Listings"}</h2>

          {listings.length === 0 ? (
            <p>No listings found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(listing => (
                <div key={listing.id} className="border p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold">{listing.name}</h3>
                  <p className="text-gray-600">{listing.location}</p>
                  <p className="text-green-600 font-bold">${listing.price_per_hour}/hour</p>
                  
                  {/* ✅ Delete Button */}
                  <button 
                    onClick={() => handleDelete(listing.id)}
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete Listing
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileListings;