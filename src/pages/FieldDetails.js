import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FieldDetails = () => {
  const { id } = useParams(); // ✅ Get Field ID from URL
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchField = async () => {
      try {
        const docRef = doc(db, "soccerFields", id); // ✅ Fetch from "soccerFields"
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setField(docSnap.data());
        } else {
          setError("Field not found.");
        }
      } catch (error) {
        console.error("Error fetching field:", error);
        setError("Failed to load field details. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchField();
  }, [id]);

  if (loading) return <p className="text-gray-500 text-center">Loading field details...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{field.name || "Unknown Field"}</h1>
      <p className="text-gray-600">{field.location?.address || "Location not specified"}</p>
      <p className="text-green-600 font-bold">${field.price_per_hour || "N/A"}/hour</p>

      {/* Image Gallery */}
      {field.images?.length > 0 ? (
        <Swiper spaceBetween={10} slidesPerView={1} navigation pagination={{ clickable: true }} loop modules={[Navigation, Pagination]}>
          {field.images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt={`Field ${index}`} className="w-full h-64 object-cover rounded-md" />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="h-64 bg-gray-300 rounded-md flex items-center justify-center">
          <span className="text-gray-500">No images available</span>
        </div>
      )}

      {/* Booking Button */}
      <button className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
        Book This Field
      </button>
    </div>
  );
};

export default FieldDetails;