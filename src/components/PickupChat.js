import { useState, useEffect, useRef } from "react";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // ✅ Back navigation

const PickupChat = () => {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate(); // ✅ Back button functionality

  // ✅ Fetch threads in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "pickupChatThreads"), orderBy("createdAt", "desc")), (snapshot) => {
      setThreads(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch messages when a thread is selected
  useEffect(() => {
    if (!selectedThread) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "pickupChatThreads", selectedThread.id, "messages"), orderBy("timestamp", "asc")),
      (snapshot) => {
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );
    return () => unsubscribe();
  }, [selectedThread]);

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Create a new thread
  const createThread = async () => {
    if (!user) return alert("You must be logged in to create a thread.");

    const title = prompt("Enter thread title:");
    if (!title) return;

    await addDoc(collection(db, "pickupChatThreads"), {
      title,
      createdBy: user.uid,
      creatorName: user.displayName || "Anonymous",
      createdAt: new Date(),
    });
  };

  // ✅ Send a message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedThread || !user) {
      console.error("Error: Missing user or selected thread.");
      return alert("You must be logged in to send a message.");
    }

    await addDoc(collection(db, "pickupChatThreads", selectedThread.id, "messages"), {
      text: newMessage,
      senderId: user.uid || "unknown",
      senderName: user.displayName || user.email?.split("@")[0] || "Anonymous",
      timestamp: new Date(),
    });

    setNewMessage("");
  };

  // ✅ Handle thread selection, ensure user is logged in
  const handleThreadSelection = (thread) => {
    if (!user) {
      // Prompt the user to log in or redirect to login
      alert("You must be logged in to view the thread.");
      navigate("/login"); // Redirect to login page (adjust path as needed)
      return;
    }
    setSelectedThread(thread);
  };

  return (
    <div className="max-w-full mx-auto mt-12 bg-gray-900 text-white p-4 sm:p-6 rounded-lg shadow-xl flex flex-col sm:flex-row w-full h-[85vh]">
      
      {/* ✅ Sidebar: Threads List */}
      <aside className="w-full sm:w-1/3 p-4 sm:p-6 border-b sm:border-r border-gray-700 relative">
        {/* ✅ Moved arrow higher & added label */}
        <div className="absolute top-0 left-4 flex items-center gap-2">
          <button 
            onClick={() => navigate("/pickup-soccer")} 
            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition"
          >
            ← {/* ✅ Back button */}
          </button>
          <span className="text-lg text-gray-300">To Matches</span> {/* ✅ Label */}
        </div>

        {/* ✅ "Draft Thread" Box */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center mt-10">
          <span className="text-lg font-semibold">Threads</span>
          <button 
            onClick={createThread} 
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition flex items-center justify-center w-10 h-10"
          >
            ✏️ {/* ✅ Pencil Icon */}
          </button>
        </div>
        
        <div className="space-y-3 mt-4">
          {threads.length === 0 ? (
            <p className="text-gray-400">No threads available.</p>
          ) : (
            threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => handleThreadSelection(thread)} // ✅ Use the new function to handle selection
                className={`w-full p-3 rounded-lg text-left hover:bg-gray-700 transition flex justify-between ${
                  selectedThread?.id === thread.id ? "bg-blue-700" : ""
                }`}
              >
                <span>{thread.title}</span>
                <span className="text-sm text-gray-300">{thread.creatorName}</span>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* ✅ Messages Panel */}
      <div className="w-full sm:w-2/3 p-4 sm:p-6">
        {selectedThread ? (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold">{selectedThread.title}</h2>
            <p className="text-gray-400 text-sm">Created by {selectedThread.creatorName}</p>

            <div className="h-96 overflow-y-auto space-y-4 border border-gray-700 p-4 rounded-lg mt-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`p-3 rounded-lg ${
                  msg.senderId === user.uid ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-200"
                }`}>
                  <strong className="block">{msg.senderName}</strong>
                  <p>{msg.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* ✅ Input Field */}
            <div className="mt-4 flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow p-3 bg-gray-800 text-white rounded-l-lg border border-gray-700"
              />
              <button onClick={sendMessage} className="bg-blue-600 text-white px-6 rounded-r-lg hover:bg-blue-700 transition">
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-400">Select a thread to view messages.</p>
        )}
      </div>
    </div>
  );
};

export default PickupChat;
