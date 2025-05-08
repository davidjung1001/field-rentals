import { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const PickupChat = () => {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "pickupChatThreads"), orderBy("createdAt", "desc")),
      (snapshot) => {
        setThreads(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedThread) return;
    const unsubscribe = onSnapshot(
      query(
        collection(db, "pickupChatThreads", selectedThread.id, "messages"),
        orderBy("timestamp", "asc")
      ),
      (snapshot) => {
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );
    return () => unsubscribe();
  }, [selectedThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const sendMessage = async () => {
    if (!user) {
      alert("You must be logged in to send a message.");
      return;
    }

    if (!newMessage.trim() || !selectedThread) return;

    await addDoc(
      collection(db, "pickupChatThreads", selectedThread.id, "messages"),
      {
        text: newMessage,
        senderId: user.uid,
        senderName:
          user.displayName || user.email?.split("@")[0] || "Anonymous",
        timestamp: new Date(),
      }
    );

    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center">
      <div className="w-full max-w-6xl flex flex-col sm:flex-row flex-grow overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-gray-800 p-4 sm:p-6 overflow-y-auto max-h-[40vh] sm:max-h-none">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => navigate("/pickup-soccer")}
              className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition"
            >
              ←
            </button>
            <span className="text-base text-gray-300">To Matches</span>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Threads</span>
            <button
              onClick={createThread}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
            >
              ✏️
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto">
            {threads.length === 0 ? (
              <p className="text-gray-400">No threads available.</p>
            ) : (
              threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  className={`w-full p-3 rounded-lg text-left hover:bg-gray-700 transition flex justify-between ${
                    selectedThread?.id === thread.id ? "bg-blue-700" : ""
                  }`}
                >
                  <span className="truncate">{thread.title}</span>
                  <span className="text-sm text-gray-300">
                    {thread.creatorName}
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Chat window */}
        <main className="w-full sm:w-2/3 flex flex-col p-4 sm:p-6 bg-gray-900 max-h-screen">
          {selectedThread ? (
            <>
              <header className="mb-2">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {selectedThread.title}
                </h2>
                <p className="text-sm text-gray-400">
                  Created by {selectedThread.creatorName}
                </p>
              </header>

              <div className="flex-1 overflow-y-auto border border-gray-700 p-4 rounded-lg bg-gray-800 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[80%] sm:max-w-[60%] p-3 rounded-xl break-words ${
                      msg.senderId === user?.uid
                        ? "bg-blue-600 text-white ml-auto text-right"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    <strong className="block text-sm text-gray-300">
                      {msg.senderName}
                    </strong>
                    <p className="text-base">{msg.text}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              {/* Message input */}
<div className="mt-4">
  <div className="flex">
    <input
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder={
        user ? "Type a message..." : "Login to send a message"
      }
      disabled={!user}
      className={`flex-grow p-3 bg-gray-800 text-white rounded-l-lg border border-gray-700 focus:outline-none ${
        !user ? "opacity-50 cursor-not-allowed" : ""
      }`}
    />
    <button
      onClick={sendMessage}
      disabled={!user}
      className={`bg-blue-600 text-white px-6 rounded-r-lg transition ${
        user ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed"
      }`}
    >
      Send
    </button>
  </div>
  {!user && (
    <p className="mt-2 text-sm text-red-400">
      🔒 You must be logged in to send messages.
    </p>
  )}
</div>

            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-center text-base">
              Select a thread to view messages.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PickupChat;
