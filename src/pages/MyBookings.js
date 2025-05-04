import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUid, setCurrentUid] = useState(null);

  useEffect(() => {
    // ✅ Get current logged-in user's UID
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUid(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUid) return;

      try {
        console.log("Fetching bookings for user UID:", currentUid);

        // ✅ Fetch bookings where "bookedBy" matches current user UID
        const q = query(collection(db, "bookings"), where("bookedBy", "==", currentUid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No bookings found.");
        }

        const fetchedBookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched Bookings:", fetchedBookings);
        setBookings(fetchedBookings);
      } catch (error) {
        console.error("❌ Error fetching user bookings:", error);
      }

      setLoading(false);
    };

    if (currentUid) fetchBookings();
  }, [currentUid]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2 className="text-3xl font-bold">My Bookings</h2>

          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map(booking => (
                <div key={booking.id} className="border p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold">{booking.fieldName}</h3>
                  <p className="text-gray-600">📅 {booking.date}</p>
                  <p className="text-gray-600">⏰ {booking.timeRange.start} - {booking.timeRange.end}</p>
                  <p className="text-green-600 font-bold">💰 ${booking.totalPrice}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyBookings;