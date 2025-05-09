import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ImageUpload from "../components/ImageUpload";

const PostTryout = () => {
  const [form, setForm] = useState({
    teamName: "",
    ageGroup: "",
    division: "",
    location: "",
    metroCity: "",
    extraInfo: "",
    coachFirstName: "",
    coachLastName: "",
    coachContact: "", // For phone or email
  });

  const [dateTime, setDateTime] = useState(null);
  const [imageURLs, setImageURLs] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "youthTryouts"), {
        ...form,
        time: dateTime ? dateTime.toString() : "",
        imageURLs,
        userId: user?.uid || "anonymous",
        username: user?.displayName || "Unknown Coach",
        createdAt: Timestamp.now(),
      });
      navigate("/");
    } catch (err) {
      console.error("Failed to post tryout:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-24 p-8 bg-zinc-900 text-white rounded-2xl shadow-xl">
      {/* Back Arrow */}
      <Link to="/" className="text-blue-400 text-sm hover:underline mb-6 inline-block">
        &larr; Back to sections
      </Link>
      
      <h1 className="text-3xl font-bold mb-8 text-center">Post a Youth Tryout</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            name="teamName"
            placeholder="Team or Club Name"
            value={form.teamName}
            onChange={handleChange}
            required
            className="w-full p-4 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="ageGroup"
            placeholder="Age Group (e.g. U11, U12)"
            value={form.ageGroup}
            onChange={handleChange}
            required
            className="w-full p-4 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            name="division"
            placeholder="Division (e.g. D1, D2, Select)"
            value={form.division}
            onChange={handleChange}
            required
            className="w-full p-4 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="location"
            placeholder="Practice Location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full p-4 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm mb-2">Nearest Metro City</label>
          <input
            name="metroCity"
            placeholder="Nearest Metro City (e.g. Dallas, Houston)"
            value={form.metroCity}
            onChange={handleChange}
            required
            className="w-full p-4 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm mb-2">Tryout Date & Time</label>
          <DatePicker
            selected={dateTime}
            onChange={(date) => setDateTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full p-4 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Select date and time"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            name="coachFirstName"
            placeholder="Coach First Name"
            value={form.coachFirstName}
            onChange={handleChange}
            required
            className="w-full p-4 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="coachLastName"
            placeholder="Coach Last Name"
            value={form.coachLastName}
            onChange={handleChange}
            required
            className="w-full p-4 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm mb-2">Coach Contact (Phone or Email)</label>
          <input
            name="coachContact"
            placeholder="Phone or Email"
            value={form.coachContact}
            onChange={handleChange}
            required
            className="w-full p-4 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm mb-2">Optional Image</label>
          <ImageUpload setImageURLs={setImageURLs} />
        </div>

        <div>
          <textarea
            name="extraInfo"
            placeholder="Additional Info (coach contact, gear needed, etc.)"
            value={form.extraInfo}
            onChange={handleChange}
            rows={4}
            className="w-full p-4 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Submit Tryout
        </button>
      </form>
    </div>
  );
};

export default PostTryout;
