import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";
import ImageUpload from "./ImageUpload";

const EditField = () => {
  const { fieldId } = useParams();
  const navigate = useNavigate();  // For navigating back to the profile page
  const [fieldData, setFieldData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFieldDetails = async () => {
      try {
        const fieldRef = doc(db, "soccerFields", fieldId);
        const fieldSnap = await getDoc(fieldRef);

        if (fieldSnap.exists()) {
          const data = fieldSnap.data();
          setFieldData(data);
          setFormData(data); // Initialize formData with fetched data
        } else {
          console.error("Field not found.");
        }
      } catch (error) {
        console.error("❌ Error fetching field details:", error);
      }
      setLoading(false);
    };

    fetchFieldDetails();
  }, [fieldId]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (newURLs) => {
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...newURLs],
    }));
  };

  const handleDeleteImage = (urlToDelete) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((url) => url !== urlToDelete),
    }));
  };

  const handleSave = async () => {
    try {
      const fieldRef = doc(db, "soccerFields", fieldId);
      await updateDoc(fieldRef, formData);
      setFieldData(formData); // Update the fieldData with the new formData
      alert("✅ Field updated!");
    } catch (error) {
      console.error("❌ Error updating field:", error);
    }
  };

  const handleBack = () => {
    navigate(`/profile/${fieldData?.uid}`); // Navigate to the profile page
  };

  const handleDelete = async () => {
    try {
      const fieldRef = doc(db, "soccerFields", fieldId);
      await deleteDoc(fieldRef);
      alert("❌ Field deleted!");
      navigate(`/profile/${fieldData?.uid}`); // Redirect to the profile page after deletion
    } catch (error) {
      console.error("❌ Error deleting field:", error);
    }
  };

  const handleCancel = () => {
    setFormData(fieldData); // Reset to the original data
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <button
        onClick={handleBack}
        className="text-blue-500 hover:text-blue-700 mb-6 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 12H5M12 5l-7 7 7 7"
          />
        </svg>
        Back to Profile
      </button>

      {loading ? (
        <p>Loading field details...</p>
      ) : fieldData ? (
        <>
          <h2 className="text-3xl font-bold mb-8 text-center">Edit Field</h2>

          {/* Field Name Section */}
          <section className="mb-6">
            <label className="block text-sm font-semibold">Field Name</label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </section>

          {/* Price Per Hour Section */}
          <section className="mb-6">
            <label className="block text-sm font-semibold">Price Per Hour</label>
            <input
              type="number"
              value={formData.price_per_hour || ""}
              onChange={(e) => handleChange("price_per_hour", e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </section>

          {/* Description Section */}
          <section className="mb-6">
            <label className="block text-sm font-semibold">Description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </section>

          {/* Images Section */}
          <section className="mb-6">
            <label className="block text-sm font-semibold">Images</label>
            <ImageUpload setImageURLs={handleImageUpload} />

            {/* Image Previews */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {(formData.images || []).map((url) => (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt="Field"
                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                  />
                  <button
                    onClick={() => handleDeleteImage(url)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>

            <div className="flex space-x-4">
              <button
                onClick={handleCancel}
                className="text-gray-600 border px-6 py-3 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel Editing
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
              >
                Delete Listing
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>Field not found.</p>
      )}
    </div>
  );
};

export default EditField;
