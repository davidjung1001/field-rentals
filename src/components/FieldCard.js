import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FieldCard = ({ field }) => {
  return (
    <Link 
      to={`/field/${field.id}`} 
      className="block w-full max-w-[350px] lg:max-w-[500px] xl:max-w-[600px] transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div className="relative">
        {/* ✅ Image Slider */}
        {field.images?.length > 0 ? (
          <Swiper spaceBetween={10} slidesPerView={1} navigation pagination={{ clickable: true }} loop modules={[Navigation, Pagination]}>
            {field.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img 
                  src={image} 
                  alt={`Field ${index}`} 
                  className="w-full h-64 object-cover rounded-md"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="h-64 bg-gray-300 rounded-md flex items-center justify-center">
            <span className="text-gray-500">No images available</span>
          </div>
        )}
      </div>

      {/* ✅ Separate Field Info Below Images */}
      <div className="p-3 bg-white rounded-b-md shadow flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{field.name || "Unknown Field"}</h3>
          <p className="text-sm text-gray-600">{field.location || "No location provided"}</p>
          <p className="text-xs text-gray-500">Posted by: {field.hostUsername || "Unknown"}</p>
        </div>
        <p className="text-green-600 font-bold">${field.price_per_hour || "N/A"}/hour</p>
      </div>
    </Link>
  );
};

export default FieldCard;