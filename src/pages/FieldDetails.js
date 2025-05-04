import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaArrowLeft } from "react-icons/fa";
import BookNowCard from "../components/BookNowCard";

const FieldDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchFieldDetails = async () => {
      try {
        const fieldRef = doc(db, "soccerFields", id);
        const fieldSnap = await getDoc(fieldRef);

        if (fieldSnap.exists()) {
          setField(fieldSnap.data());
        } else {
          console.error("⚠️ Field not found in Firestore.");
          setError("Field not found.");
        }
      } catch (error) {
        console.error("❌ Error fetching field details:", error);
        setError("Failed to load field details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFieldDetails();
  }, [id]);

  useEffect(() => {
    // ✅ Fetch logged-in user
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Function to update Firestore when editing
  const handleUpdate = async (key, value) => {
    try {
      const fieldRef = doc(db, "soccerFields", id);
      await updateDoc(fieldRef, { [key]: value });
      setField((prev) => ({ ...prev, [key]: value }));
      console.log("✅ Field updated:", key);
    } catch (error) {
      console.error("❌ Error updating field:", error);
    }
  };

  // ✅ Check if logged-in user is the host
  const isHost = field?.hostId === user?.uid;

  if (loading) return <p className="text-gray-500 text-center">Loading field details...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* ✅ Back to Fields Button */}
      <button 
        onClick={() => navigate("/")} 
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition"
      >
        <FaArrowLeft className="mr-2" /> Back to Fields
      </button>

      <div className="text-left">
        <h1 className="text-3xl font-bold">{field?.name || "Unknown Field"}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ✅ Left Column - Image & Field Info */}
        <div className="flex-1">
          {/* ✅ Image Gallery */}
          <div className="w-full max-w-[800px] mx-auto mb-6">
            {field?.images?.length > 0 ? (
              <Swiper spaceBetween={10} slidesPerView={1} navigation pagination={{ clickable: true }} loop modules={[Navigation, Pagination]}>
                {field.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img src={image} alt={`Field ${index}`} className="w-full h-[600px] object-contain rounded-md" />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="h-[500px] bg-gray-300 rounded-md flex items-center justify-center">
                <span className="text-gray-500">No images available</span>
              </div>
            )}
          </div>

          <div className="text-left">
            <p className="text-xs text-gray-500">Posted by: {field?.hostUsername || "Unknown"}</p>
            <p className="text-gray-700">{field?.location || "Location not specified"}</p>
            <p className="text-green-600 font-bold">${field?.price_per_hour || "N/A"}/hour</p>
          </div>

          {/* ✅ Tab Navigation */}
          <div className="flex mt-6 space-x-6 border-b pb-2">
            {["Overview", "Policy & Rules", "Parking & Access"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-lg font-semibold px-4 py-2 ${activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ✅ Editable Tab Content for Hosts */}
          <div className="mt-4">
            {activeTab === "Overview" && (
              isHost ? (
                <textarea
                  value={field?.description || ""}
                  onChange={(e) => handleUpdate("description", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter field overview..."
                />
              ) : (
                <p>{field?.description || "No description available."}</p>
              )
            )}

            {activeTab === "Policy & Rules" && (
              isHost ? (
                <textarea
                  value={field?.policy || ""}
                  onChange={(e) => handleUpdate("policy", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter policy & rules..."
                />
              ) : (
                <p>{field?.policy || "Policy details not specified."}</p>
              )
            )}

            {activeTab === "Parking & Access" && (
              isHost ? (
                <textarea
                  value={field?.parking_info || ""}
                  onChange={(e) => handleUpdate("parking_info", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter parking & access details..."
                />
              ) : (
                <p>{field?.parking_info || "Parking details not specified."}</p>
              )
            )}
          </div>
        </div>

        {/* ✅ Right Column - Booking Card */}
        <div className={`w-full lg:w-[500px] sticky top-20 transition-all duration-500 ease-in-out ${scrollPosition > 100 ? "translate-y-4 opacity-90" : "opacity-100"} mt-10`}>
          <BookNowCard field={field} fieldId={id} />
        </div>
      </div>
    </div>
  );
};

export default FieldDetails;