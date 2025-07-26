// Redesigned Discuss.jsx with modern UI and Clear Chat feature
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Navbar from "../Navbar";
const backendUrl = 'https://codelikho.onrender.com';
import { io } from "socket.io-client";
import Footer from "../../src/pages/Footer";


const ComingSoon = ({ title }) => (
  <div className="flex-1 flex items-center justify-center h-[500px] bg-gray-800/60 border border-gray-700 rounded-xl shadow-lg backdrop-blur-sm">
    <div className="text-center p-8">
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-400 via-purple-600 to-pink-500 text-transparent bg-clip-text">
        Coming Soon
      </h1>
      <h2 className="text-3xl font-bold text-purple-300 mt-4">
        {title} Coming Soon!
      </h2>
      <p className="text-gray-400 mt-2">We're working hard on it 🚀</p>
    </div>
  </div>
);

function Discuss() {
  const socketRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeRoom, setActiveRoom] = useState("global");
  const [roomId, setRoomId] = useState("");
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomAction, setRoomAction] = useState("create");
  const [onlineUsers, setOnlineUsers] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("chat");
  const { user } = useSelector((state) => state.auth);
  const activeRoomRef = useRef(activeRoom);

  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socketRef.current = io(backendUrl, {
      withCredentials: true,
      auth: { token: localStorage.getItem("token") },
    });

    socketRef.current.on("connect", () => joinRoom("global"));
    socketRef.current.on("user-count", (count) => setOnlineUsers(count));
    socketRef.current.on("message", (newMessage) => {
      if (newMessage.room === activeRoomRef.current) {
        setMessages((prev) => [
          ...prev,
          { ...newMessage, isMe: newMessage.sender === socketRef.current.id },
        ]);
      }
    });

    socketRef.current.on("room-created", (room) => {
      setActiveRoom(room);
      setShowRoomModal(false);
      setMessages([]);
    });

    socketRef.current.on("room-joined", (room) => {
      setActiveRoom(room);
      setShowRoomModal(false);
      setMessages([]);
    });

    socketRef.current.on("room-error", (error) => alert(`Room error: ${error}`));

    return () => socketRef.current?.disconnect();
  }, []);

  const joinRoom = (room) => {
    if (socketRef.current) {
      socketRef.current.emit("join-room", room);
      setActiveRoom(room);
      setMessages([]);
    }
  };

  const handleRoomAction = () => {
    if (!roomId.trim()) return;
    socketRef.current.emit(roomAction === "create" ? "create-room" : "join-room", roomId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMessage = {
      text: message,
      sender: socketRef.current.id,
      room: activeRoom,
      username: user?.firstName || "Anonymous",
    };
    socketRef.current.emit("message", newMessage);
    setMessage("");
    inputRef.current?.focus();
  };

  const clearChat = () => setMessages([]);

  const getAvatar = (userId) => `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex mb-6 border-b border-gray-700">
          {["chat", "video", "code"].map((key) => (
            <button
              key={key}
              className={`mr-6 pb-2 text-lg font-medium transition-colors ${
                activeTab === key
                  ? "text-cyan-400 border-b-2 border-cyan-500"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab(key)}
            >
              <i className={`fas fa-${key === "chat" ? "comments" : key === "video" ? "video" : "code"} mr-2`} />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-1 bg-gray-800/60 border border-gray-700 rounded-xl p-4 shadow-xl">
            <h3 className="text-cyan-300 font-bold mb-4">
              <i className="fas fa-list mr-2" /> Rooms
            </h3>
            <button
              className={`w-full px-4 py-2 rounded-lg mb-3 transition ${
                activeRoom === "global" ? "bg-cyan-700 text-white" : "bg-gray-700/50 hover:bg-gray-700"
              }`}
              onClick={() => joinRoom("global")}
            >
              Global Room <span className="float-right text-xs">{onlineUsers} online</span>
            </button>

            <h3 className="text-cyan-300 font-bold mb-2 mt-6">
              <i className="fas fa-user mr-2" /> You
            </h3>
            <div className="flex items-center gap-3 bg-gray-700/50 p-3 rounded-lg">
              <img
                src={getAvatar(user?.firstName || "U")}
                className="w-10 h-10 rounded-full border-2 border-cyan-500"
              />
              <div className="text-green-400">{user?.firstName || "User"} (Online)</div>
            </div>
          </div>

          <div className="lg:col-span-4">
            {activeTab === "chat" && (
              <div className="bg-gray-800/70 rounded-xl border border-gray-700 shadow-xl flex flex-col h-[70vh]">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                  <h2 className="text-xl font-bold text-cyan-300">
                    <i className="fas fa-comments mr-2" /> Chat in #{activeRoom}
                  </h2>
                  <div className="flex gap-2">
  <button
    onClick={() => {
      setRoomAction("create");
      setShowRoomModal(true);
    }}
    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg"
  >
    <i className="fas fa-plus mr-1" /> Create Room
  </button>
  <button
    onClick={() => {
      setRoomAction("join");
      setShowRoomModal(true);
    }}
    className="bg-cyan-700 hover:bg-cyan-600 px-4 py-2 rounded-lg"
  >
    <i className="fas fa-sign-in-alt mr-1" /> Join Room
  </button>
  <button
    onClick={clearChat}
    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
  >
    <i className="fas fa-trash mr-1" /> Clear Chat
  </button>
</div>

                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-24">
                      <i className="fas fa-comment-slash text-4xl mb-2" />
                      <p>No messages yet in #{activeRoom}</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`flex max-w-[70%] ${msg.isMe ? "flex-row-reverse" : ""}`}>
                          <img src={getAvatar(msg.sender)} className="w-10 h-10 rounded-full border-2 border-cyan-500 mx-2" />
                          <div className={`p-3 rounded-xl ${msg.isMe ? "bg-cyan-700" : "bg-gray-700"}`}>
                            <div className="text-sm font-bold text-amber-300">
                              {msg.isMe ? user?.firstName || "You" : msg.username || `User`}
                            </div>
                            <div className="text-white text-md">{msg.text}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
                  <div className="flex gap-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Message in #${activeRoom}`}
                      className="flex-1 bg-gray-700/60 px-4 py-3 rounded-lg focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="bg-cyan-600 hover:bg-cyan-500 px-5 py-3 rounded-lg text-white"
                    >
                      <i className="fas fa-paper-plane mr-1" /> Send
                    </button>
                  </div>
                </form>
              </div>
            )}
            {activeTab === "video" && <ComingSoon title="Video Chat" />}
            {activeTab === "code" && <ComingSoon title="Code Editor" />}
          </div>
        </div>
      </div>

      {showRoomModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-cyan-600">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-cyan-300">
                {roomAction === "create" ? "Create Room" : "Join Room"}
              </h2>
              <button onClick={() => setShowRoomModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times text-xl" />
              </button>
            </div>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRoomModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRoomAction}
                disabled={!roomId.trim()}
                className="flex-1 px-4 py-2 bg-cyan-700 hover:bg-cyan-600 rounded-lg"
              >
                {roomAction === "create" ? "Create" : "Join"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer/>
     
    </div>
  );
}

export default Discuss;
