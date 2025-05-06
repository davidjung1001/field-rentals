// [Imports remain unchanged]
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

  const [editMode, setEditMode] = useState({
    description: false,
    policy: false,
    parking_info: false,
  });
  const [tempValues, setTempValues] = useState({
    description: "",
    policy: "",
    parking_info: "",
  });

  useEffect(() => {
    const fetchFieldDetails = async () => {
      try {
        const fieldRef = doc(db, "soccerFields", id);
        const fieldSnap = await getDoc(fieldRef);
        if (fieldSnap.exists()) {
          setField(fieldSnap.data());
        } else {
          setError("Field not found.");
        }
      } catch (error) {
        setError("Failed to load field details.");
      } finally {
        setLoading(false);
      }
    };
    fetchFieldDetails();
  }, [id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUpdate = async (key, value) => {
    try {
      const fieldRef = doc(db, "soccerFields", id);
      await updateDoc(fieldRef, { [key]: value });
      setField((prev) => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  const isHost = field?.hostId === user?.uid;

  const startEdit = (key) => {
    setEditMode((prev) => ({ ...prev, [key]: true }));
    setTempValues((prev) => ({ ...prev, [key]: field?.[key] || "" }));
  };

  const cancelEdit = (key) => {
    setEditMode((prev) => ({ ...prev, [key]: false }));
  };

  const saveEdit = async (key) => {
    await handleUpdate(key, tempValues[key]);
    setEditMode((prev) => ({ ...prev, [key]: false }));
  };

  if (loading) return <p className="text-gray-500 text-center">Loading field details...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-14">
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition"
      >
        <FaArrowLeft className="mr-2" /> Back to Fields
      </button>

      <div className="text-left mb-4">
        <h1 className="text-3xl font-bold">{field?.name || "Unknown Field"}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left content */}
        <div className="flex-1">
          {/* Image Carousel */}
          <div className="w-full max-w-[800px] mx-auto mb-6 p-4 bg-white rounded-xl shadow-lg border border-gray-400">
            {field?.images?.length > 0 ? (
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                loop
                modules={[Navigation, Pagination]}
              >
                {field.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`Field ${index}`}
                      className="w-full h-[500px] object-cover rounded-lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="h-[500px] bg-gray-100 border border-dashed border-gray-400 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-gray-500">No images available</span>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="text-left">
            <p className="text-xs text-gray-500">Posted by: {field?.hostUsername || "Unknown"}</p>
            <p className="text-gray-700">{field?.location || "Location not specified"}</p>
            <p className="text-green-600 font-bold">${field?.price_per_hour || "N/A"}/hour</p>
          </div>

          {/* Tabs */}
          <div className="flex mt-6 space-x-6 border-b pb-2">
            {["Overview", "Policy & Rules", "Parking & Access"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-lg font-semibold px-4 py-2 ${activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="mt-4">
            {["Overview", "Policy & Rules", "Parking & Access"].map((tab) => {
              const key =
                tab === "Overview" ? "description" :
                  tab === "Policy & Rules" ? "policy" :
                    "parking_info";

              return activeTab === tab ? (
                <div key={key} className="mb-6">
                  {isHost && editMode[key] ? (
                    <div>
                      <textarea
                        value={tempValues[key]}
                        onChange={(e) =>
                          setTempValues((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className="w-full p-2 border rounded-md"
                        rows={6}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => saveEdit(key)}
                          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => cancelEdit(key)}
                          className="bg-gray-300 text-black px-4 py-1 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="whitespace-pre-wrap">{field?.[key] || "No information provided."}</p>
                      {isHost && (
                        <button
                          onClick={() => startEdit(key)}
                          className="mt-2 inline-block text-blue-500 hover:text-blue-700 text-sm"
                        >
                          ✏️ Edit
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : null;
            })}
          </div>
        </div>

        {/* Right Booking Card */}
        <div
          className={`w-full lg:w-[500px] sticky top-20 transition-all duration-500 ease-in-out ${scrollPosition > 100
            ? "translate-y-4 opacity-90"
            : "opacity-100"
            } mt-10`}
        >
          <BookNowCard field={field} fieldId={id} />
        </div>
      </div>
    </div>
  );
};

export default FieldDetails;
