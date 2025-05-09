import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import YouthTryoutCard from "../components/YouthTryoutCard";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const YouthTryouts = () => {
  const [tryouts, setTryouts] = useState([]);

  useEffect(() => {
    const fetchTryouts = async () => {
      const snapshot = await getDocs(collection(db, "youthTryouts"));
      setTryouts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchTryouts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
  {/* Back Button */}
  <div className="mb-6">
    <Link
      to="/"
      className="text-blue-600 flex items-center space-x-2 hover:text-blue-500"
    >
      <FaArrowLeft size={18} />
      <span className="text-md">Back to Sections</span>
    </Link>
  </div>

  {/* 🎯 Entire dark container with header and cards */}
  <div className="bg-zinc-800 rounded-2xl shadow-2xl p-8 sm:p-12 text-white">
    {/* Header inside dark container */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
      <h1 className="text-3xl font-bold">Youth Soccer Tryouts</h1>
      <Link
        to="/post-tryout"
        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-md font-medium"
      >
        Post a Tryout
      </Link>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {tryouts.length > 0 ? (
        tryouts.map((tryout) => (
          <YouthTryoutCard key={tryout.id} tryout={tryout} />
        ))
      ) : (
        <p className="text-gray-300 col-span-full text-center text-lg">
          No tryouts posted yet.
        </p>
      )}
    </div>
  </div>
</div>


  );
};

export default YouthTryouts;
