import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import axios from "axios";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "../cloudinaryConfig";

const AddField = () => {
  const [fieldData, setFieldData] = useState({
    name: "",
    location: "", // ✅ Added Location Field
    price_per_hour: "",
    images: [],
    category: "11v11",
    surface: "grass",
    type: "outdoor",
  });

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
        const response = await axios.post(CLOUDINARY_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageURLs.push(response.data.secure_url);
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
      }
    }

    setUploading(false);
    setFieldData({ ...fieldData, images: imageURLs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "soccerFields"), {
        name: fieldData.name,
        location: fieldData.location, // ✅ Location is now included in Firestore
        price_per_hour: Number(fieldData.price_per_hour),
        images: fieldData.images.length > 0 ? fieldData.images : [],
        category: fieldData.category,
        surface: fieldData.surface,
        type: fieldData.type,
      });

      alert("Field added successfully!");
      setFieldData({
        name: "",
        location: "", // ✅ Reset Location Field
        price_per_hour: "",
        images: [],
        category: "11v11",
        surface: "grass",
        type: "outdoor",
      });
    } catch (error) {
      console.error("Firestore error:", error);
      alert(`Failed to add field: ${error.message}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🏟️ Add a New Soccer Field</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Field Name"
          className="w-full border rounded-lg p-2"
          value={fieldData.name}
          onChange={(e) => setFieldData({ ...fieldData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          className="w-full border rounded-lg p-2"
          value={fieldData.location}
          onChange={(e) => setFieldData({ ...fieldData, location: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price per Hour"
          className="w-full border rounded-lg p-2"
          value={fieldData.price_per_hour}
          onChange={(e) => setFieldData({ ...fieldData, price_per_hour: e.target.value })}
          required
        />
        <select className="w-full border rounded-lg p-2" onChange={(e) => setFieldData({ ...fieldData, category: e.target.value })}>
          <option value="11v11">11v11</option>
          <option value="9v9">9v9</option>
          <option value="7v7">7v7</option>
          <option value="5v5">5v5</option>
        </select>
        <select className="w-full border rounded-lg p-2" onChange={(e) => setFieldData({ ...fieldData, surface: e.target.value })}>
          <option value="grass">Grass</option>
          <option value="turf">Turf</option>
        </select>
        <select className="w-full border rounded-lg p-2" onChange={(e) => setFieldData({ ...fieldData, type: e.target.value })}>
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
        </select>
        <input type="file" multiple accept="image/*" className="w-full border rounded-lg p-2" onChange={handleImageUpload} />
        {uploading && <p className="text-blue-500">Uploading images...</p>}
        {fieldData.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {fieldData.images.map((url, index) => (
              <img key={index} src={url} alt="Uploaded preview" className="w-full h-20 object-cover rounded-lg" />
            ))}
          </div>
        )}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
          ➕ Add Field
        </button>
      </form>
    </div>
  );
};

export default AddField;