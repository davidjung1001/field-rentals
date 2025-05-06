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
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const response = await axios.post(CLOUDINARY_URL, formData);
        imageURLs.push(response.data.secure_url);
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
      }
    }

    setUploading(false);

    if (imageURLs.length > 0) {
      setImageURLs(imageURLs); // ✅ Only update if successful
    }
  };

  return (
    <div className="mt-2">
      <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
      {uploading && <p className="text-sm text-gray-500">Uploading images...</p>}
    </div>
  );
};

export default ImageUpload;
