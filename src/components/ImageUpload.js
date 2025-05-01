import { useState } from "react";
import axios from "axios";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "../cloudinaryConfig";

const ImageUpload = ({ setImageURLs }) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const imageURLs = [];
    setUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET); // ✅ Uses your preset

      try {
        const response = await axios.post(CLOUDINARY_URL, formData);
        imageURLs.push(response.data.secure_url); // ✅ Store Cloudinary image URLs
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
      }
    }

    setUploading(false);
    setImageURLs(imageURLs); // ✅ Send URLs to parent component (e.g., AddField.js)
  };

  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
      {uploading && <p>Uploading images...</p>}
    </div>
  );
};

export default ImageUpload;