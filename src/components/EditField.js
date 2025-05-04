import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useParams } from "react-router-dom";

const EditField = () => {
  const { fieldId } = useParams();
  const [fieldData, setFieldData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFieldDetails = async () => {
      try {
        const fieldRef = doc(db, "soccerFields", fieldId);
        const fieldSnap = await getDoc(fieldRef);

        if (fieldSnap.exists()) {
          setFieldData(fieldSnap.data());
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

  const handleUpdate = async (key, value) => {
    try {
      const fieldRef = doc(db, "soccerFields", fieldId);
      await updateDoc(fieldRef, { [key]: value });
      setFieldData((prev) => ({ ...prev, [key]: value }));
      console.log("✅ Field updated:", key);
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

          {/* Editable Field Name */}
          <label className="block mt-4 text-sm font-semibold">Field Name</label>
          <input 
            type="text" 
            value={fieldData.name || ""} 
            onChange={(e) => handleUpdate("name", e.target.value)} 
            className="w-full p-2 border rounded"
          />

          {/* Editable Price */}
          <label className="block mt-4 text-sm font-semibold">Price Per Hour</label>
          <input 
            type="number" 
            value={fieldData.price_per_hour || ""} 
            onChange={(e) => handleUpdate("price_per_hour", e.target.value)} 
            className="w-full p-2 border rounded"
          />

          {/* Editable Description */}
          <label className="block mt-4 text-sm font-semibold">Description</label>
          <textarea 
            value={fieldData.description || ""} 
            onChange={(e) => handleUpdate("description", e.target.value)} 
            className="w-full p-2 border rounded"
          />
        </>
      ) : (
        <p>Field not found.</p>
      )}
    </div>
  );
};

export default EditField;