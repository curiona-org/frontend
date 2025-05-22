"use client";
import { useAuth } from "@/providers/auth-provider";
import { BorderBeam } from "../magicui/border-beam";
import { useState } from "react";
import Image from "next/image";

export default function Chatbot() {
  const { session } = useAuth();
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
        className="fixed bottom-0 right-0 mr-20 mb-20 w-32 h-32 flex items-center justify-center cursor-pointer bg-white-500 rounded-3xl shadow-lg"
        aria-label="Open Chat"
        title="Open Chat"
      >
        <span className="text-display-2 select-none">🤖</span>
        <BorderBeam duration={6} size={100} />
        <BorderBeam duration={6} delay={3} size={100} />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 w-[480px] h-[525px] bg-white-500 border-2 border-blue-500 rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <div className="text-heading-1 text-white rounded-full p-1">🤖</div>
          <div>
            <h4 className="text-mobile-heading-4-bold lg:text-heading-4-bold text-blue-600">
              Eriona
            </h4>
            <span className="text-mobile-body-1-regular lg:text-body-1-regular text-blue-400">
              Your Roadmap Assistant
            </span>
          </div>
        </div>
        <button
          className="w-9 h-9 bg-blue-50 rounded-lg text-blue-400 hover:text-blue-600 font-bold"
          onClick={() => setIsOpen(false)} // toggle close chat
          aria-label="Close Chat"
          title="Close Chat"
        >
          ✕
        </button>
      </div>

      <div className="dashedLine"></div>

      {/* Chat messages */}
      <div className="flex flex-col overflow-y-auto p-8 space-y-8 h-full">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.from === "bot" && (
              <span className="text-heading-3 mr-2">🤖</span>
            )}

            <div
              className={`p-4 rounded-md ${
                msg.from === "bot"
                  ? "bg-white-500 shadow-md"
                  : "w-60 bg-blue-600 shadow-md text-white-500 text-end"
              }`}
            >
              {msg.text}
            </div>

            {msg.from === "user" && (
              <img
                src={session.user.avatar}
                alt="User Avatar"
                className="w-8 h-8 rounded-full ml-2"
              />
            )}
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="p-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="Try ask our chatbot"
          className="flex-1 border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-blue-600 text-white-500 rounded p-2 hover:bg-blue-700"
          onClick={handleSend}
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 256 256"
          >
            <path
              fill="currentColor"
              d="M225.88 30.12a13.83 13.83 0 0 0-13.7-3.58h-.11L20.14 84.77A14 14 0 0 0 18 110.85l85.56 41.64L145.12 238a13.87 13.87 0 0 0 12.61 8c.4 0 .81 0 1.21-.05a13.9 13.9 0 0 0 12.29-10.09l58.2-191.93v-.11a13.83 13.83 0 0 0-3.55-13.7m-8 10.4l-58.15 191.91v.11a2 2 0 0 1-3.76.26l-40.68-83.58l49-49a6 6 0 1 0-8.49-8.49l-49 49L23.15 100a2 2 0 0 1 .31-3.74h.11l191.91-58.18a1.94 1.94 0 0 1 1.92.52a2 2 0 0 1 .52 1.92Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
