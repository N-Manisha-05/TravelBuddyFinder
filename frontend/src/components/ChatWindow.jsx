import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { sendMessage, getTripMessages } from "../services/chatService";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

const ChatWindow = ({ tripId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Fetch messages + join socket room
  useEffect(() => {
    const fetchMessages = async () => {
      const msgs = await getTripMessages(tripId);
      setMessages(msgs);
    };
    fetchMessages();

    // ✅ Join correct room
    socket.emit("joinTrip", tripId);

    // ✅ Listen for new messages from server
    socket.on("receiveMessage", (msg) => {
      if (msg.trip === tripId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      // cleanup
      socket.off("receiveMessage");
      socket.emit("leaveTrip", tripId);
    };
  }, [tripId]);

  // Send message (only API call, controller broadcasts)
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    await sendMessage(tripId, newMessage); // backend will socket.emit()
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`flex ${
              m.sender?._id === currentUser._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-2xl max-w-xs ${
                m.sender?._id === currentUser._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <p className="text-sm">{m.message}</p>
              <span className="text-xs opacity-70 block mt-1">
                {m.sender?.name || "You"} •{" "}
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input box */}
      <div className="border-t p-3 flex items-center bg-gray-50">
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 mr-2 focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 flex items-center"
        >
          <PaperAirplaneIcon className="w-4 h-4 mr-1" />
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;