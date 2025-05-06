import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import FieldCard from "./FieldCard";

const FieldListings = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFields = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(query(collection(db, "soccerFields"), orderBy("name"), limit(10)));
      setFields(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    fetchFields();
  }, []);

  return (
    <div className="bg-gray-100 p-6 md:p-10 rounded-3xl shadow-xl max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Available Fields</h2>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {fields.length > 0 ? fields.map((field) => <FieldCard key={field.id} field={field} />) : (
            <p className="text-gray-500 text-center col-span-full">No fields available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FieldListings;