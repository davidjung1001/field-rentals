import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51N5e77C0NdgmZvsoAXo0lwYvF8VsuU7fVvF9Kt54hQhc94vHmO2oDDXCsxsUS78rq2icliS9drK5Ht5Cr9LHnqZg009oSFH8ni");

const BookNowCard = ({ fieldId }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState({});
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [fieldInfo, setFieldInfo] = useState(null);

  useEffect(() => {
    const fetchFieldData = async () => {
      if (!fieldId) return;
      setLoading(true);

      try {
        const fieldRef = doc(db, "soccerFields", fieldId);
        const fieldSnap = await getDoc(fieldRef);

        if (fieldSnap.exists()) {
          const fieldData = fieldSnap.data();
          setFieldInfo(fieldData);

          const availabilityData = fieldData.availability || {};
          setAvailableTimes(availabilityData);
          console.log("✅ Fetched field and availability:", fieldData);
        } else {
          console.error("⚠️ No field data found.");
          setFieldInfo(null);
          setAvailableTimes({});
        }
      } catch (error) {
        console.error("❌ Error fetching field data:", error);
        setFieldInfo(null);
        setAvailableTimes({});
      }

      setLoading(false);
    };

    fetchFieldData();
  }, [fieldId]);

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
    setSelectedStartTime("");
    setSelectedEndTime("");
  };

  const formattedDate = selectedDate ? selectedDate.toISOString().split("T")[0] : "";
  const availableSlots = availableTimes[formattedDate] || [];
  const hasAvailability = Object.keys(availableTimes).length > 0;

  if (loading) {
    return (
      <div className="sticky top-50 w-full max-w-sm bg-white shadow-md rounded-lg p-5 border">
        <p>Loading availability...</p>
      </div>
    );
  }

  if (!hasAvailability) {
    return (
      <div className="sticky top-50 w-full max-w-sm bg-white shadow-md rounded-lg p-5 border text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">No availability set for this field.</h2>
        {fieldInfo?.phoneNumber ? (
          <p className="text-gray-700">
            📞 You can still <strong>book manually</strong> by contacting the host:
            <br />
            <span className="text-blue-600 font-medium">{fieldInfo.phoneNumber}</span>
          </p>
        ) : (
          <p className="text-gray-500">Contact info not available.</p>
        )}
      </div>
    );
  }

  return (
    <div className="sticky top-50 w-full max-w-sm bg-white shadow-md rounded-lg p-5 border">
      {paymentStep ? (
        <Elements stripe={stripePromise}>
          <CheckoutForm amount={50} goBack={() => setPaymentStep(false)} />
        </Elements>
      ) : (
        <>
          <h2 className="text-xl font-bold text-gray-800">Book This Field</h2>

          {/* ✅ Date Picker */}
          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-700">Select Date</label>
            <div 
              className="flex items-center border rounded-md p-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <span className="text-gray-600">{selectedDate ? selectedDate.toLocaleDateString() : "Choose a date"}</span>
            </div>
            {isCalendarOpen && (
              <DatePicker
                selected={selectedDate}
                onChange={handleDateSelection}
                className="border p-2 rounded w-full"
                inline
                dayClassName={(date) => {
                  const formattedDate = date.toISOString().split("T")[0];
                  return availableTimes[formattedDate] ? "bg-green-500 text-white rounded-full" : "";
                }}
              />
            )}
          </div>

          {/* ✅ Start Time Selection */}
          {selectedDate && availableSlots.length > 0 && (
            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-700">Select Start Time</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedStartTime(time)}
                    className={`px-4 py-2 rounded-md ${
                      selectedStartTime === time ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ✅ End Time Selection */}
          {selectedStartTime && (
            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-700">Select End Time</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableSlots
                  .filter((time) => time > selectedStartTime)
                  .map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedEndTime(time)}
                      className={`px-4 py-2 rounded-md ${
                        selectedEndTime === time ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setPaymentStep(true)}
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
            disabled={!selectedStartTime || !selectedEndTime}
          >
            Proceed to Booking 💳
          </button>
        </>
      )}
    </div>
  );
};

export default BookNowCard;
