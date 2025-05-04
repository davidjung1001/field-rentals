import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const BookNowCard = ({ field, fieldId }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState({ start: "", end: "" });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [availableTimes, setAvailableTimes] = useState({});
  const [bookedSlots, setBookedSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const hourlyRate = field?.ratePerHour || 20;

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!fieldId) return;

      setLoading(true);
      try {
        const fieldRef = doc(db, "fieldAvailability", fieldId);
        const docSnap = await getDoc(fieldRef);

        if (docSnap.exists()) {
          setAvailableTimes(docSnap.data().availability || {});
          setBookedSlots(docSnap.data().bookedSlots || {});
        }
      } catch (error) {
        console.error("❌ Error fetching availability:", error);
      }
      setLoading(false);
    };

    fetchAvailability();
  }, [fieldId]);

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setSelectedTimeRange({ start: "", end: "" });
    setIsCalendarOpen(false);

    const formattedDate = date.toISOString().split("T")[0];

    if (!availableTimes[formattedDate]) {
      setAvailableTimes((prev) => ({
        ...prev,
        [formattedDate]: [],
      }));
    }
  };

  const isSlotBooked = (date, time) => {
    const bookings = bookedSlots[date] || [];
    if (!Array.isArray(bookings)) return false;
    return bookings.some((slot) => time >= slot.start && time < slot.end);
  };

  const calculatePrice = () => {
    if (!selectedTimeRange.start || !selectedTimeRange.end) return;
    const startHour = parseInt(selectedTimeRange.start.split(":")[0]);
    const endHour = parseInt(selectedTimeRange.end.split(":")[0]);
    const duration = endHour - startHour;
    setCalculatedPrice(duration * hourlyRate);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTimeRange.start || !selectedTimeRange.end) {
      alert("Please select a valid date and time range.");
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];
    const fieldRef = doc(db, "fieldAvailability", fieldId);

    try {
      setLoading(true);

      const fieldSnap = await getDoc(fieldRef);
      const existingData = fieldSnap.exists() ? fieldSnap.data() : {};

      const updatedBookedSlots = {
        ...existingData.bookedSlots,
        [formattedDate]: [...(Array.isArray(existingData.bookedSlots?.[formattedDate]) ? existingData.bookedSlots[formattedDate] : []), 
                          { start: selectedTimeRange.start, end: selectedTimeRange.end }]
      };

      await updateDoc(fieldRef, { bookedSlots: updatedBookedSlots });

      setBookingConfirmed(true);
    } catch (error) {
      console.error("❌ Error updating booking:", error);
      alert("Failed to book the field.");
    }
    setLoading(false);
  };

  return (
    <div className="sticky top-50 w-full max-w-sm bg-white shadow-md rounded-lg p-5 border">
      {bookingConfirmed ? (
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">✅ Thank You for Booking!</h2>
          <p className="text-gray-600 mt-2">Your reservation has been confirmed.</p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold text-gray-800">Book This Field</h2>
          <p className="text-gray-600 mt-2">{field?.name || "Unknown Field"}</p>

          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-700">Select Date</label>
            <div 
              className="flex items-center border rounded-md p-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <span className="text-gray-600">{selectedDate ? selectedDate.toLocaleDateString() : "Choose a date"}</span>
            </div>
            {isCalendarOpen && <DatePicker 
            selected={selectedDate} 
            onChange={handleDateSelection} 
            className="border p-2 rounded w-full" 
            inline 
            dayClassName={(date) => {
              const formattedDate = date.toISOString().split("T")[0];
              return availableTimes[formattedDate] ? "bg-green-400 text-white rounded-full" : "";
            }}
          />}
          </div>

          {selectedDate && availableTimes[selectedDate.toISOString().split("T")[0]]?.length > 0 ? (
            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-700">Select Time Range</label>
              <div className="flex items-center gap-4 mt-2">
                <FaClock className="text-gray-500" />
                <select className="border p-2 rounded w-1/3"
                  value={selectedTimeRange.start}
                  onChange={(e) => { setSelectedTimeRange((prev) => ({ ...prev, start: e.target.value })); calculatePrice(); }}>
                  <option value="">Start</option>
                  {availableTimes[selectedDate.toISOString().split("T")[0]].map((time) => (
                    <option key={time} value={time} disabled={isSlotBooked(selectedDate.toISOString().split("T")[0], time)}>{time}</option>
                  ))}
                </select>
                <span>—</span>
                <select className="border p-2 rounded w-1/3"
                  value={selectedTimeRange.end}
                  onChange={(e) => { setSelectedTimeRange((prev) => ({ ...prev, end: e.target.value })); calculatePrice(); }}>
                  <option value="">End</option>
                  {availableTimes[selectedDate.toISOString().split("T")[0]].map((time) => (
                    <option key={time} value={time} disabled={isSlotBooked(selectedDate.toISOString().split("T")[0], time)}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No times available</p>
          )}

          {selectedDate && selectedTimeRange.start && selectedTimeRange.end && (
            <button onClick={handleBooking}
              className="mt-4 w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition">
              Confirm Booking ({selectedTimeRange.start} - {selectedTimeRange.end}) - 💰 ${calculatedPrice}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default BookNowCard;