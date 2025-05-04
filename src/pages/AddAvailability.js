import { useState, useEffect } from "react";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddAvailability = () => {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]); 
  const [selectedTimeRange, setSelectedTimeRange] = useState({ start: "", end: "" });
  const [availableTimes, setAvailableTimes] = useState({});
  const [loading, setLoading] = useState(false);

  const generateTimeSlots = () => {
    return Array.from({ length: 36 }, (_, i) => {
      const hours = Math.floor(i / 2) + 6;
      const minutes = (i % 2) * 30;
      return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    });
  };

  const allTimeSlots = generateTimeSlots();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const fieldRef = doc(db, "fieldAvailability", fieldId);
        const docSnap = await getDoc(fieldRef);
        if (docSnap.exists()) {
          setAvailableTimes(docSnap.data().availability || {});
        }
      } catch (error) {
        console.error("❌ Error fetching availability:", error);
      }
      setLoading(false);
    };

    fetchAvailability();
  }, [fieldId]);

  const handleDateSelection = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDates((prev) =>
      prev.includes(formattedDate) ? prev.filter((d) => d !== formattedDate) : [...prev, formattedDate]
    );
  };

  const handleTimeRangeSelection = (type, time) => {
    setSelectedTimeRange((prev) => ({ ...prev, [type]: time }));
  };

  const selectTimeRange = () => {
    if (!selectedTimeRange.start || !selectedTimeRange.end) {
      alert("Please select both start and end times.");
      return;
    }

    const startIndex = allTimeSlots.indexOf(selectedTimeRange.start);
    const endIndex = allTimeSlots.indexOf(selectedTimeRange.end);

    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
      alert("Invalid time range selected.");
      return;
    }

    const selectedTimes = allTimeSlots.slice(startIndex, endIndex + 1);

    if (selectedDates.length === 0) {
      alert("Please select at least one date.");
      return;
    }

    setAvailableTimes((prev) => {
      const updatedTimes = { ...prev };
      selectedDates.forEach((date) => {
        updatedTimes[date] = [...new Set([...(prev[date] || []), ...selectedTimes])];
      });
      return updatedTimes;
    });

    alert("✅ Time range added successfully!");
  };

  const handleSaveAvailability = async () => {
    if (!user?.uid) {
      alert("You must be logged in to save availability.");
      return;
    }

    if (selectedDates.length === 0) {
      alert("Please select at least one date.");
      return;
    }

    setLoading(true);
    const batch = writeBatch(db);
    const fieldRef = doc(db, "fieldAvailability", fieldId);

    try {
      batch.set(fieldRef, {
        fieldId: fieldId, // ✅ Link availability to the correct field
        hostId: user.uid, // ✅ Store host ID for better tracking
        availability: availableTimes
      }, { merge: true });

      await batch.commit();
      alert("✅ Availability saved successfully!");
      navigate(`/field/${fieldId}`);
    } catch (error) {
      console.error("❌ Error saving availability:", error);
      alert("Failed to save availability.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">📅 Set Availability</h2>

      {loading && <p className="text-gray-500">Loading...</p>}

      <label className="block text-lg font-semibold mb-2">Select Multiple Dates:</label>
      <DatePicker selected={null} onChange={handleDateSelection} className="border p-2 rounded w-full" inline multi />

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Select Time Range:</h3>
        <div className="flex justify-between">
          <select
            className="border p-2 rounded w-1/2"
            value={selectedTimeRange.start}
            onChange={(e) => handleTimeRangeSelection("start", e.target.value)}
          >
            <option value="">Start Time</option>
            {allTimeSlots.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>

          <select
            className="border p-2 rounded w-1/2"
            value={selectedTimeRange.end}
            onChange={(e) => handleTimeRangeSelection("end", e.target.value)}
          >
            <option value="">End Time</option>
            {allTimeSlots.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <button onClick={selectTimeRange} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          ✅ Add Time Range
        </button>
      </div>

      <button
        onClick={handleSaveAvailability}
        className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
      >
        💾 Save Availability
      </button>
    </div>
  );
};

export default AddAvailability;