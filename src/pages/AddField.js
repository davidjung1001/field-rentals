import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { CLOUDINARY_URL, UPLOAD_PRESET } from "../cloudinaryConfig";

const AddField = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); // ✅ Subscription status
  const [uploading, setUploading] = useState(false);
  const [fieldData, setFieldData] = useState({
    name: "",
    location: "",
    price_per_hour: "",
    phoneNumber: "",  // ✅ Phone number for manual bookings
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
          const userRef = doc(db, "users", u.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUsername(userSnap.data().username || "Unknown Host");
            setSubscriptionStatus(userSnap.data().subscriptionStatus || "inactive"); // ✅ Fetch subscription status
          } else {
            console.warn("⚠️ No user data found.");
          }
        } catch (error) {
          console.error("❌ Error fetching user data:", error);
        }
      } else {
        console.error("⚠️ No user detected—please log in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    const uploadedImages = await Promise.all(files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const response = await axios.post(CLOUDINARY_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

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

    if (!fieldData.name || !fieldData.location || !fieldData.price_per_hour || !fieldData.phoneNumber) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const tempFieldId = crypto.randomUUID();
      const updatedFieldData = {
        ...fieldData,
        fieldId: tempFieldId,
        hostId: user.uid,
        hostUsername: username,
        phoneNumber: fieldData.phoneNumber, // ✅ Store phone number for manual bookings
        availability: subscriptionStatus === "active" ? {} : null, // ❌ Availability locked for non-subscribers
        bookedSlots: subscriptionStatus === "active" ? {} : null,
      };

      const fieldRef = doc(db, "soccerFields", tempFieldId);
      await setDoc(fieldRef, updatedFieldData);

      console.log("✅ Field saved successfully:", updatedFieldData);

      if (subscriptionStatus === "active") {
        navigate(`/add-availability/${tempFieldId}`, { state: { fieldData: updatedFieldData } });
      } else {
        alert("✅ Field listed! To enable bookings, upgrade your subscription.");
      }
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
        <p className="text-sm text-gray-600">Listing as: <strong>{username}</strong></p>

        <input type="text" placeholder="Field Name" className="w-full border rounded-lg p-2"
          value={fieldData.name} onChange={(e) => setFieldData({ ...fieldData, name: e.target.value })} required />
        <input type="text" placeholder="Location" className="w-full border rounded-lg p-2"
          value={fieldData.location} onChange={(e) => setFieldData({ ...fieldData, location: e.target.value })} required />
        <input type="number" placeholder="Price per Hour" className="w-full border rounded-lg p-2"
          value={fieldData.price_per_hour} onChange={(e) => setFieldData({ ...fieldData, price_per_hour: e.target.value })} required />
        <input type="text" placeholder="Phone Number for Bookings" className="w-full border rounded-lg p-2"
          value={fieldData.phoneNumber} onChange={(e) => setFieldData({ ...fieldData, phoneNumber: e.target.value })} required />

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
          ➕ List Field
        </button>

        <button 
          onClick={() => {
            if (subscriptionStatus === "active") {
              navigate(`/add-availability/${fieldData.fieldId}`, { state: { fieldData } });
            }
          }}
          className={`w-full py-2 rounded-lg ${
            subscriptionStatus === "active"
              ? "bg-green-500 text-white hover:bg-green-600 transition"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          disabled={subscriptionStatus !== "active"}
        >
          ➕ Add Availability
        </button>

        {subscriptionStatus !== "active" && (
          <p className="text-red-500 text-center mt-2">
            ⚠️ To enable availability and bookings, upgrade your subscription.
            <br />
            <button onClick={() => navigate("/manage-subscription")} className="text-blue-600 underline">
              Manage Subscription
            </button>
          </p>
        )}
      </form>
    </div>
  );
};

export default AddField;