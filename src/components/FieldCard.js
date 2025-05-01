import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FieldCard = ({ field }) => {
  return (
    <Link to={`/field/${field.id}`} className="block bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
      {/* Image Slider */}
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

      {/* Field Info */}
      <h2 className="text-lg font-semibold text-gray-800">{field.name || "Unknown Field"}</h2>
      <p className="text-gray-600">{field.location || "No location provided"}</p> {/* ✅ Fix location retrieval */}
      <p className="text-green-600 font-bold">${field.price_per_hour || "N/A"}/hour</p>
    </Link>
  );
};

export default FieldCard;