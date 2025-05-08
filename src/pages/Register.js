import { useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  signOut 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFieldOwner, setIsFieldOwner] = useState(false);  // ✅ New state for field owner selection
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🚀 Send email verification
      await sendEmailVerification(user);
      alert("📩 Verification email sent! Please check your inbox.");

      // ✅ Store user info in Firestore, including Field Owner status
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { 
        uid: user.uid, 
        username, 
        email, 
        isFieldOwner,  // ✅ Field owner status stored in Firestore
        subscriptionStatus: "inactive",  // Default subscription status
        profilePicture: "",
      });

      // 📩 Send welcome email via backend
      
      // ❌ Prevent automatic login by signing out the user
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      setError(err.message);
      console.error("Registration error:", err);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      alert("Please enter your email to reset your password!");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("📩 Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Password reset error:", error.message);
      alert("❌ Failed to send reset email.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Display Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
          />

          {/* ✅ Field Owner Checkbox */}
          <div className="flex items-center">
            <input 
              type="checkbox"
              checked={isFieldOwner}
              onChange={(e) => setIsFieldOwner(e.target.checked)}
              className="mr-2"
            />
            <label>Are you a field owner?</label>
          </div>

          <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">
            🚀 Sign Up
          </button>
        </form>

     

        <p className="text-sm text-center mt-4 text-gray-700">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;