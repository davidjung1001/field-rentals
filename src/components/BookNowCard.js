import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

// ✅ Load Stripe for Payments
const stripePromise = loadStripe("pk_test_51N5e77C0NdgmZvsoAXo0lwYvF8VsuU7fVvF9Kt54hQhc94vHmO2oDDXCsxsUS78rq2icliS9drK5Ht5Cr9LHnqZg009oSFH8ni");

const BookNowCard = ({ fieldId }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState({ start: "", end: "" });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [availableTimes, setAvailableTimes] = useState({});
  const [loading, setLoading] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [paymentStep, setPaymentStep] = useState(false);

  useEffect(() => {
    const fetchFieldAvailability = async () => {
      if (!fieldId) return;
      setLoading(true);

      try {
        // ✅ Fetch from "fieldAvailability" instead of "soccerFields"
        const fieldRef = doc(db, "fieldAvailability", fieldId);
        const docSnap = await getDoc(fieldRef);

        if (docSnap.exists()) {
          const availabilityData = docSnap.data().availability || {};
          setAvailableTimes(availabilityData);
          console.log("✅ Fetched correct availability:", availabilityData);
        } else {
          console.error("⚠️ No availability data found.");
        }
      } catch (error) {
        console.error("❌ Error fetching availability:", error);
      }

      setLoading(false);
    };

    fetchFieldAvailability();
  }, [fieldId]);

  const hasAvailability = Object.keys(availableTimes).length > 0 &&
                          Object.values(availableTimes).some(slots => slots.length > 0);

  // 🚨 If no availability, show "No Online Booking Available"
  if (!hasAvailability) {
    return (
      <div className="sticky top-50 w-full max-w-sm bg-white shadow-md rounded-lg p-5 border">
        <h2 className="text-xl font-bold text-gray-800">No Online Booking Available</h2>
        <p className="text-gray-500 mt-2">❌ No available time slots.</p>
      </div>
    );
  }

  return (
    <div className="sticky top-50 w-full max-w-sm bg-white shadow-md rounded-lg p-5 border">
      {paymentStep ? (
        <Elements stripe={stripePromise}>
          <CheckoutForm amount={calculatedPrice} goBack={() => setPaymentStep(false)} />
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
            {isCalendarOpen && <DatePicker 
              selected={selectedDate} 
              onChange={(date) => setSelectedDate(date)} 
              className="border p-2 rounded w-full" 
              inline 
            />}
          </div>

          <button onClick={() => setPaymentStep(true)}
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition">
            Proceed to Payment 💳 (${calculatedPrice})
          </button>
        </>
      )}
    </div>
  );
};

export default BookNowCard;