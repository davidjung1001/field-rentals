import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    } catch (err) {
      setError("Invalid email or password.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🔑 User Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input 
          type="email" placeholder="Enter email" 
          className="w-full border p-2 rounded"
          value={email} onChange={(e) => setEmail(e.target.value)} required
        />
        <input 
          type="password" placeholder="Enter password" 
          className="w-full border p-2 rounded"
          value={password} onChange={(e) => setPassword(e.target.value)} required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button 
          type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;