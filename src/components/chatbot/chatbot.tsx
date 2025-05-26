"use client";
import { useAuth } from "@/providers/auth-provider";
import { BorderBeam } from "../magicui/border-beam";
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";

interface Message {
  from: "user" | "bot";
  text: string;
  timestamp?: string;
  done: boolean;
}

interface WebSocketEvent<T> {
  type: string;
  payload: T;
}

interface WebSocketEventNewMessage {
  message: string;
  from: string;
  sent: string;
}

interface WebSocketEventRoadmapAssistChunk {
  content: string;
  done: boolean;
}

interface WebSocketRequest {
  type: "roadmap_chat_assist_request";
  payload: {
    message: string;
  };
}

export default function Chatbot({ slug }: { slug: string }) {
  const { session } = useAuth();
  // const [messages, setMessages] = useState([
  //   {
  //     from: "bot",
  //     text: "👋 Welcome to the Eriona Chat Assist! We're here to help you with your roadmap. Let's get started! 🚀 Feel free to ask any questions you have",
  //   },
  // ]);
  const [messages, setMessages] = useState<Message[]>([]);
  const currentMessages = useRef("");
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket
  useEffect(() => {
    if (!session || !isOpen) return;

    // koneksi websocket
    const ws = new WebSocket(
      `ws://api.curiona.34.2.143.125.sslip.io/roadmaps/${slug}/assist`,
      ["Authorization", session.tokens.access_token]
    );

    wsRef.current = ws;

    // handler saat koneksi terbuka
    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketEvent<
          WebSocketEventNewMessage | WebSocketEventRoadmapAssistChunk
        >;

        // Jika server mengirim pesan chatbot
        if (data.type === "new_message") {
          const { message, sent } = data.payload as WebSocketEventNewMessage;
          console.log("payload data:", data.payload);

          setMessages((prev) => {
            // Cari pesan loading "..." dan ganti dengan respons dari server
            const newMessages = [...prev];
            const loadingIndex = newMessages.findIndex(
              (msg) => msg.from === "bot" && msg.text === "..."
            );

            if (loadingIndex !== -1) {
              newMessages[loadingIndex] = {
                from: "bot",
                text: message,
                timestamp: sent,
                done: true,
              };
            } else {
              // Jika tidak ada pesan loading, tambahkan sebagai pesan baru
              newMessages.push({
                from: "bot",
                text: message,
                timestamp: sent,
                done: true,
              });
            }

            return newMessages;
          });
        }
        if (data.type === "roadmap_chat_assist_chunk") {
          const { content, done } =
            data.payload as WebSocketEventRoadmapAssistChunk;
          setMessages((prev) => {
            // If there's no in-progress message, start a new one
            if (prev.length === 0 || prev[prev.length - 1].done) {
              return [
                ...prev,
                {
                  text: content,
                  from: "bot",
                  timestamp: new Date().toString(),
                  done: done,
                },
              ];
            }
            // Otherwise, append to the latest in-progress message
            else {
              const lastIndex = prev.length - 1;
              const updatedMessage: Message = {
                text: prev[lastIndex].text + content,
                done: done,
                from: "bot",
                timestamp: new Date().toString(),
              };
              const newMessages = [...prev];
              newMessages[lastIndex] = updatedMessage;
              return newMessages;
            }
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    // Event handler untuk error
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Sorry, there was an error connecting to the assistant. Please try again later.",
          done: true,
        },
      ]);
    };

    // Event handler saat koneksi ditutup
    ws.onclose = (event) => {
      console.log("event: " + event);
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    // Cleanup function
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [session, isOpen, slug]);

  const handleSend = () => {
    if (!input.trim() || !wsRef.current) return;

    const userMessage = {
      from: "user" as const,
      text: input,
      timestamp: new Date().toISOString(),
      done: true,
    };

    // Kirim pesan ke server melalui WebSocket dengan format yang sesuai
    if (wsRef.current.readyState === WebSocket.OPEN) {
      // Tambahkan pesan user ke state
      setMessages((prev) => [...prev, userMessage]);
      const requestData: WebSocketRequest = {
        type: "roadmap_chat_assist_request",
        payload: {
          message: input,
        },
      };

      wsRef.current.send(JSON.stringify(requestData));
      console.log("request data: " + requestData);
    } else {
      // Jika WebSocket tidak terhubung
      setMessages((prev) => {
        const newMessages = [...prev];
        // Ganti pesan loading dengan pesan error
        newMessages[newMessages.length - 1] = {
          from: "bot",
          text: "Connection lost. Please refresh the page and try again.",
        };
        return newMessages;
      });
    }

    setInput("");
  };

  // Format timestamp menjadi format yang lebih mudah dibaca
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "";
    }
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
              Your Roadmap Assistant{" "}
              {isConnected && (
                <span className="text-green-500">• Connected</span>
              )}
            </span>
          </div>
        </div>
        <button
          className="w-9 h-9 bg-blue-50 rounded-lg text-blue-400 hover:text-blue-600 font-bold"
          onClick={() => setIsOpen(false)}
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
              <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              {msg.timestamp && (
                <div
                  className={`text-xs mt-2 ${
                    msg.from === "bot" ? "text-gray-400" : "text-blue-200"
                  }`}
                >
                  {dayjs(msg.timestamp).format("HH:mm")}
                </div>
              )}
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
        <div ref={messagesEndRef} />
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
          disabled={!isConnected}
        />
        <button
          className={`${
            isConnected ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300"
          } text-white-500 rounded p-2`}
          onClick={handleSend}
          aria-label="Send message"
          disabled={!isConnected}
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
