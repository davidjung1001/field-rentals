import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; 
import { useParams, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookField = () => {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState({}); 

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      const fieldRef = doc(db, "fieldAvailability", fieldId);
      const docSnap = await getDoc(fieldRef);

      if (docSnap.exists()) {
        const fieldData = docSnap.data();
        console.log("📌 Retrieved Availability for Field:", fieldData);

        setAvailableTimes(fieldData.availability || {});
        setBookedSlots(fieldData.bookedSlots || {});
      } else {
        console.log("⚠️ No availability found for this field.");
      }
    };

    fetchAvailability();
  }, [fieldId]);

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split("T")[0];

    setAvailableTimes(availableTimes[formattedDate] || []);
  };

  const isSlotBooked = (date, time) => {
    return bookedSlots[date]?.includes(time);
  };

  const handleBookSlot = async () => {
    if (!user || !user.uid) {
      alert("You must be logged in to book a field.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time slot.");
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];
    const fieldRef = doc(db, "fieldAvailability", fieldId);

    try {
      const fieldSnap = await getDoc(fieldRef);
      const existingData = fieldSnap.exists() ? fieldSnap.data() : {};
      const updatedBookedSlots = {
        ...existingData.bookedSlots,
        [formattedDate]: [...new Set([...(existingData.bookedSlots?.[formattedDate] || []), selectedTime])],
      };

      await updateDoc(fieldRef, { bookedSlots: updatedBookedSlots });

      alert("Booking successful! ⚽");
      navigate(`/field/${fieldId}`);
    } catch (error) {
      console.error("❌ Error booking slot:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🏟️ Book a Soccer Field</h2>

      <label className="block text-lg font-semibold mb-2">Select a Date:</label>
      <DatePicker selected={selectedDate} onChange={handleDateSelection} className="border p-2 rounded w-full" inline />

      {availableTimes.length > 0 && (
        <div className="mt-4">
          <label className="block text-lg font-semibold mb-2">Select a Time Slot:</label>
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`mr-2 mb-2 p-2 rounded border ${isSlotBooked(selectedDate?.toISOString().split("T")[0], time) ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white"}`}
              disabled={isSlotBooked(selectedDate?.toISOString().split("T")[0], time)}
            >
              {isSlotBooked(selectedDate?.toISOString().split("T")[0], time) ? `🚫 ${time} (Booked)` : time}
            </button>
          ))}
        </div>
      )}

      <button onClick={handleBookSlot} className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
        ✅ Confirm Booking
      </button>
    </div>
  );
};

export default BookField;