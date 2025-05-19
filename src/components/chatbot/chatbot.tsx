"use client";

import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Welcome to the Eriona Chat Assist! We're here to help you with your roadmap. Let's get started! 🚀 Feel free to ask any questions you have",
    },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false); // state untuk toggle chatbox

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { from: "user", text: input },
      { from: "bot", text: "..." },
    ]);
    setInput("");
    // nanti di sini baru bisa dipasang API call
  };

  if (!isOpen) {
    // tampilan kecil saat chat ditutup
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer dashedBorder bg-white"
        aria-label="Open Chat"
        title="Open Chat"
      >
        <span className="text-2xl select-none">🤖</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-[350px] bg-white border border-blue-300 rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-blue-200 p-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 text-white rounded-full p-1">🤖</div>
          <div>
            <h4 className="text-blue-600 font-semibold">Eriona</h4>
            <span className="text-xs text-blue-400">
              Your Roadmap Assistant
            </span>
          </div>
        </div>
        <button
          className="text-blue-400 hover:text-blue-600 font-bold"
          onClick={() => setIsOpen(false)} // toggle close chat
          aria-label="Close Chat"
          title="Close Chat"
        >
          ✕
        </button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 max-h-72">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md max-w-[80%] ${
              msg.from === "bot"
                ? "bg-blue-100 text-blue-800 self-start"
                : "bg-blue-600 text-white self-end"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="border-t border-blue-200 p-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="Try ask our chatbot"
          className="flex-1 border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700"
          onClick={handleSend}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
