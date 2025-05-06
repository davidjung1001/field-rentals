import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useParams } from "react-router-dom";

const EditField = () => {
  const { fieldId } = useParams();
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
          setFormData(data);
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

  const handleSave = async () => {
    try {
      const fieldRef = doc(db, "soccerFields", fieldId);
      await updateDoc(fieldRef, formData);
      setFieldData(formData);
      console.log("✅ Field updated");
    } catch (error) {
      console.error("❌ Error updating field:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      {loading ? (
        <p>Loading field details...</p>
      ) : fieldData ? (
        <>
          <h2 className="text-2xl font-bold">Edit Field</h2>

          <label className="block mt-4 text-sm font-semibold">Field Name</label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full p-2 border rounded"
          />

          <label className="block mt-4 text-sm font-semibold">Price Per Hour</label>
          <input
            type="number"
            value={formData.price_per_hour || ""}
            onChange={(e) => handleChange("price_per_hour", e.target.value)}
            className="w-full p-2 border rounded"
          />

          <label className="block mt-4 text-sm font-semibold">Description</label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full p-2 border rounded"
          />

          <button
            onClick={handleSave}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </>
      ) : (
        <p>Field not found.</p>
      )}
    </div>
  );
};

export default EditField;
