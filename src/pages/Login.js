import { useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🚨 Restrict login if email is not verified
      if (!user.emailVerified) {
        setError("❌ Please verify your email before logging in.");
        return;
      }

      setSuccessMessage("✅ Login successful!");
      navigate("/");
    } catch (err) {
      setError("❌ Invalid email or password.");
      console.error("Login error:", err);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccessMessage("");
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      setSuccessMessage("✅ Google login successful!");
      navigate("/");
    } catch (err) {
      setError("❌ Google sign-in failed.");
      console.error("Google login error:", err);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      navigate("/forgot-password")
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🔑 Welcome Back</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            required 
          />

          <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">
            🚀 Login
          </button>
        </form>

        <button 
          onClick={handleGoogleLogin}
          className="mt-4 w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
        >
          🔗 Sign in with Google
        </button>

        <button 
          onClick={handlePasswordReset} 
          className="mt-4 w-full text-blue-600 hover:underline"
        >
          Forgot Password?
        </button>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account? 
          <Link to="/register" className="text-blue-600 hover:underline ml-1">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;