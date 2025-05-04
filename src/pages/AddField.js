import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { doc, setDoc, getDoc } from "firebase/firestore"; // ✅ Added getDoc for fetching username
import { db } from "../firebaseConfig";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "../cloudinaryConfig";

const AddField = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(""); // ✅ Store username separately
  const [uploading, setUploading] = useState(false);
  const [fieldData, setFieldData] = useState({
    name: "",
    location: "",
    price_per_hour: "",
    images: [],
    category: "11v11",
    surface: "grass",
    type: "outdoor",
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);

        try {
          // ✅ Fetch username from Firestore
          const userRef = doc(db, "users", u.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUsername(userSnap.data().username || "Unknown Host");
          } else {
            console.warn("⚠️ No username found.");
          }
        } catch (error) {
          console.error("❌ Error fetching username:", error);
        }
      } else {
        console.error("⚠️ No user detected—please log in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    console.log("Selected files:", files);

    setUploading(true);

    const uploadedImages = await Promise.all(files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      console.log("Uploading file:", file.name);

      try {
        const response = await axios.post(CLOUDINARY_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("✅ Upload success:", response.data.secure_url);
        return response.data.secure_url;
      } catch (error) {
        console.error("❌ Cloudinary Upload Failed:", error.response?.data || error.message);
        return null;
      }
    }));

    setUploading(false);

    setFieldData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...uploadedImages.filter((url) => url !== null)],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      alert("You must be logged in to add a field.");
      return;
    }

    if (!fieldData.name || !fieldData.location || !fieldData.price_per_hour) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const tempFieldId = crypto.randomUUID();
      const updatedFieldData = {
        ...fieldData,
        fieldId: tempFieldId,
        hostId: user.uid,
        hostUsername: username, // ✅ Save Username
        availability: {},
        bookedSlots: {},
      };

      // ✅ Save Field with Username
      const fieldRef = doc(db, "soccerFields", tempFieldId);
      await setDoc(fieldRef, updatedFieldData);

      console.log("✅ Field saved successfully:", updatedFieldData);
      navigate(`/add-availability/${tempFieldId}`, { state: { fieldData: updatedFieldData } });
    } catch (error) {
      console.error("❌ Error saving field:", error);
      alert("Failed to save field. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-10 text-xl text-red-500">
        🔒 You must be logged in to add a field.
        <br />
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🏟️ Add a New Soccer Field</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">Listing as: <strong>{username}</strong></p> {/* ✅ Show username */}
        <input type="text" placeholder="Field Name" className="w-full border rounded-lg p-2"
          value={fieldData.name} onChange={(e) => setFieldData({ ...fieldData, name: e.target.value })} required />
        <input type="text" placeholder="Location" className="w-full border rounded-lg p-2"
          value={fieldData.location} onChange={(e) => setFieldData({ ...fieldData, location: e.target.value })} required />
        <input type="number" placeholder="Price per Hour" className="w-full border rounded-lg p-2"
          value={fieldData.price_per_hour} onChange={(e) => setFieldData({ ...fieldData, price_per_hour: e.target.value })} required />
        <select className="w-full border rounded-lg p-2"
          onChange={(e) => setFieldData({ ...fieldData, category: e.target.value })}
          value={fieldData.category}
        >
          <option value="11v11">11v11</option>
          <option value="9v9">9v9</option>
          <option value="7v7">7v7</option>
          <option value="5v5">5v5</option>
        </select>
        <select className="w-full border rounded-lg p-2"
          onChange={(e) => setFieldData({ ...fieldData, surface: e.target.value })}
          value={fieldData.surface}
        >
          <option value="grass">Grass</option>
          <option value="turf">Turf</option>
        </select>
        <select className="w-full border rounded-lg p-2"
          onChange={(e) => setFieldData({ ...fieldData, type: e.target.value })}
          value={fieldData.type}
        >
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
        </select>

        <input type="file" multiple accept="image/*"
          className="w-full border rounded-lg p-2"
          onChange={handleImageUpload}
        />
        {uploading && <p className="text-blue-500">Uploading images...</p>}
        {fieldData.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {fieldData.images.map((url, index) => (
              <img key={index} src={url} alt="Uploaded preview" className="w-full h-20 object-cover rounded-lg" />
            ))}
          </div>
        )}

        <button type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          ➕ Next: Set Availability
        </button>
      </form>
    </div>
  );
};

export default AddField;