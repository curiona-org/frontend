"use client";
import config from "@/lib/config";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import dayjs from "dayjs";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { BorderBeam } from "../magicui/border-beam";
import Button from "../ui/button";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isBotResponding, setIsBotResponding] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chunkQueueRef = useRef<{ content: string; done: boolean }[]>([]);
  const processingChunkRef = useRef(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const adjustInputHeight = useCallback(() => {
    const ta = inputRef.current;
    if (!ta) return;

    // Reset height untuk pengukuran yang akurat
    ta.style.height = "auto";

    // Ukuran yang lebih akurat
    const lineHeight = 24; // Sesuaikan dengan line-height yang digunakan
    const minHeight = 64; // 4rem

    // Ukur scrollHeight
    const scrollHeight = ta.scrollHeight;

    // Untuk input kosong atau satu baris
    if (scrollHeight <= 44) {
      // Sesuaikan nilai ini berdasarkan pengujian
      // Centering vertikal dengan flex
      ta.style.display = "flex";
      ta.style.alignItems = "center";
      ta.style.height = `${minHeight}px`;
      ta.style.overflowY = "hidden";
    }
    // Untuk 2-3 baris
    else if (scrollHeight <= lineHeight * 3 + 20) {
      ta.style.display = "block"; // Kembali ke display block
      ta.style.height = `${minHeight}px`;
      ta.style.overflowY = "hidden";
      ta.style.paddingTop = "12px";
      ta.style.paddingBottom = "12px";
    }
    // Lebih dari 3 baris
    else {
      ta.style.display = "block";
      ta.style.height = `${minHeight}px`;
      ta.style.overflowY = "auto";
      ta.style.paddingTop = "12px";
      ta.style.paddingBottom = "12px";
    }
  }, []);

  useEffect(() => {
    adjustInputHeight();
  }, [input, adjustInputHeight]);

  // Typing speed in milliseconds (higher = slower)
  const typingDelayRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    setInputError(val.length > 300);
  };

  // Process chunks from queue with delay
  const processNextChunk = useCallback(async () => {
    if (processingChunkRef.current || chunkQueueRef.current.length === 0)
      return;

    processingChunkRef.current = true;
    const { content, done } = chunkQueueRef.current.shift()!;

    // Add a delay before processing the chunk
    await new Promise((resolve) => setTimeout(resolve, typingDelayRef.current));

    setMessages((prev) => {
      // If there's no in-progress message, start a new one
      if (prev.length === 0 || prev[prev.length - 1].done) {
        return [
          ...prev,
          {
            text: content,
            from: "bot",
            timestamp: new Date().toISOString(),
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
          timestamp: new Date().toISOString(),
        };

        const newMessages = [...prev];
        newMessages[lastIndex] = updatedMessage;

        // If the message is now complete, set bot as not responding
        if (done) {
          setIsBotResponding(false);
        }

        return newMessages;
      }
    });

    processingChunkRef.current = false;

    // Process next chunk if available
    if (chunkQueueRef.current.length > 0) {
      processNextChunk();
    }
  }, [chunkQueueRef]);

  // Process chunks when they're added to the queue
  useEffect(() => {
    if (chunkQueueRef.current.length > 0 && !processingChunkRef.current) {
      processNextChunk();
    }
  }, [processNextChunk]);

  // WebSocket
  useEffect(() => {
    if (!session || !isOpen) return;

    // Reset chunk queue when opening the chat
    chunkQueueRef.current = [];
    processingChunkRef.current = false;

    console.log(
      `[WEBSOCKET] Connecting to ws://${config.WEBSOCKET_URL}/roadmaps/${slug}/assist`
    );
    // koneksi websocket
    const ws = new WebSocket(
      `${config.WEBSOCKET_URL}/roadmaps/${slug}/assist`,
      ["Authorization", session.tokens.access_token]
    );
    wsRef.current = ws;

    // handler saat koneksi terbuka
    ws.onopen = () => {
      console.log("[WEBSOCKET] Connected!");
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

          setIsBotResponding(false);
        }

        if (data.type === "roadmap_chat_assist_chunk") {
          const chunk = data.payload as WebSocketEventRoadmapAssistChunk;

          // Set bot as responding when receiving chunks
          if (!chunk.done) {
            setIsBotResponding(true);
          }

          // Add chunk to queue and process if not already processing
          chunkQueueRef.current.push(chunk);
          if (!processingChunkRef.current) {
            processNextChunk();
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        setIsBotResponding(false);
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
      setIsBotResponding(false);
    };

    // Event handler saat koneksi ditutup
    ws.onclose = (event) => {
      console.log("[WEBSOCKET] Event: " + event);
      console.log("[WEBSOCKET] Connection closed");
      setIsConnected(false);
      setIsBotResponding(false);
    };

    // Cleanup function
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        wsRef.current = null;
      }
      // Clear chunk queue
      chunkQueueRef.current = [];
      processingChunkRef.current = false;
    };
  }, [session, isOpen, slug]);

  const handleSend = () => {
    if (inputError) {
      return;
    }

    if (!input.trim() || !wsRef.current || isBotResponding) return;

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

      // Set bot as responding when sending a message
      setIsBotResponding(true);

      // Clear any existing chunks
      chunkQueueRef.current = [];
      processingChunkRef.current = false;
    } else {
      // Jika WebSocket tidak terhubung
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Connection lost. Please refresh the page and try again.",
          done: true,
        },
      ]);
    }

    setInput("");
  };

  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="fixed bottom-0 -right-10 lg:right-0 mr-20 mb-20 w-16 h-16 lg:w-32 lg:h-32 flex items-center justify-center cursor-pointer bg-white-500 rounded-3xl shadow-lg"
        aria-label="Open Chat"
        title="Open Chat"
      >
        <span className="text-mobile-display-2 lg:text-display-2 select-none">
          🤖
        </span>
        <BorderBeam duration={6} size={100} />
        <BorderBeam duration={6} delay={3} size={100} />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="fixed bottom-0 lg:bottom-8 -right-0 lg:right-8 w-full h-[525px] md:w-[480px] lg:h-[525px] bg-white-500 border-2 border-blue-500 rounded-2xl shadow-lg flex flex-col">
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
              {!isConnected && (
                <span className="text-red-500">• Disconnected</span>
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
          <Message key={idx} message={msg} avatar={session.user.avatar} />
        ))}
        {/* Typing indicator when bot is responding but no message is being shown yet */}
        {isBotResponding &&
          messages.length > 0 &&
          messages[messages.length - 1].from === "user" &&
          chunkQueueRef.current.length === 0 && (
            <div className="flex items-end justify-start">
              <span className="text-heading-3 mr-2">🤖</span>
              <div className="p-4 rounded-md bg-white-500 shadow-md">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                    style={{ animationDelay: "600ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input box */}
      <div className="p-3">
        {/* Container relatif agar tombol posisinya absolut di dalam area input */}
        <div className="relative w-full">
          <textarea
            ref={inputRef}
            placeholder="Try ask our chatbot"
            className={cn(
              inputError && "border-red-500 focus:ring-red-400",
              !inputError && "border-blue-500 focus:ring-blue-400",
              "w-full bg-transparent px-5 border-2 rounded-lg resize-none hide-scrollbar focus:outline-none focus:ring-2 focus:border-blue-500 bg-white placeholder-gray-400"
            )}
            value={input}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isBotResponding) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            style={{
              lineHeight: "1.5",
              minHeight: "4rem",
              paddingRight: "4rem",
              transition: "height 0.2s ease",
              // Untuk perataan vertikal awal (akan diubah oleh adjustInputHeight)
              display: "flex",
              alignItems: "center",
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!isConnected || isBotResponding || inputError}
            className={cn(
              isConnected && !isBotResponding && !inputError
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-300 text-white cursor-not-allowed",
              "absolute right-3 p-2"
            )}
            style={{ top: "50%", transform: "translateY(-50%)" }} // Ubah ke 50% untuk perataan vertikal yang lebih baik
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 256 256"
            >
              <path
                fill="var(--white-500)"
                d="M225.88 30.12a13.83 13.83 0 0 0-13.7-3.58h-.11L20.14 84.77A14 14 0 0 0 18 110.85l85.56 41.64L145.12 238a13.87 13.87 0 0 0 12.61 8c.4 0 .81 0 1.21-.05a13.9 13.9 0 0 0 12.29-10.09l58.2-191.93v-.11a13.83 13.83 0 0 0-3.55-13.7m-8 10.4l-58.15 191.91v.11a2 2 0 0 1-3.76.26l-40.68-83.58l49-49a6 6 0 1 0-8.49-8.49l-49 49L23.15 100a2 2 0 0 1 .31-3.74h.11l191.91-58.18a1.94 1.94 0 0 1 1.92.52a2 2 0 0 1 .52 1.92Z"
              />
            </svg>
          </Button>
        </div>
        <p
          className={cn(
            inputError ? "text-red-500" : "text-gray-500",
            "mt-1 text-xs"
          )}
        >
          ({input.length} / 300)
        </p>
      </div>
    </div>
  );
}

const Message = memo(
  ({ message, avatar }: { message: Message; avatar: string }) => {
    return (
      <div
        className={`flex items-end ${
          message.from === "user" ? "justify-end" : "justify-start"
        }`}
      >
        {message.from === "bot" && (
          <span className="text-heading-3 mr-2">🤖</span>
        )}
        <div
          className={`p-4 rounded-md ${
            message.from === "bot"
              ? "bg-white-500 shadow-md text-black-500"
              : "w-60 bg-blue-600 shadow-md text-white-500 text-end break-words"
          }`}
        >
          <Markdown
            components={{
              h1: (props) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { node, ...rest } = props;
                return (
                  <h1
                    className="text-heading-3 font-bold text-black-500 py-2"
                    {...rest}
                  />
                );
              },
              h2: (props) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { node, ...rest } = props;
                return (
                  <h2
                    className="text-heading-3 font-bold text-black-500 py-2"
                    {...rest}
                  />
                );
              },
              h3: (props) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { node, ...rest } = props;
                return (
                  <h3
                    className="text-heading-4-bold text-black-500 py-2"
                    {...rest}
                  />
                );
              },
              h4: (props) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { node, ...rest } = props;
                return (
                  <h4
                    className="text-heading-4-bold text-black-500 py-2"
                    {...rest}
                  />
                );
              },
              p: (props) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { node, ...rest } = props;
                return (
                  <p className="text-body-1-regular py-2 leading-6" {...rest} />
                );
              },
              pre: (props) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { node, ...rest } = props;
                return (
                  <pre
                    className="bg-gray-100 p-4 rounded-md overflow-x-auto"
                    {...rest}
                  />
                );
              },
              code: (props) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { node, ...rest } = props;
                return (
                  <code
                    className="bg-gray-200 text-blue-500 px-1 py-0.5 rounded"
                    {...rest}
                  />
                );
              },
              ul: (props) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { node, ...rest } = props;
                return <ul className="list-disc pl-5 space-y-1" {...rest} />;
              },
              ol: (props) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { node, ...rest } = props;
                return <ol className="list-decimal pl-5 space-y-1" {...rest} />;
              },
              li: (props) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { node, ...rest } = props;
                return <li className="text-body-1-regular" {...rest} />;
              },
              a: (props) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { node, ...rest } = props;
                return (
                  <a
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Disclaimer: This is an external link generated by the bot, please verify the link before clicking."
                    title="Disclaimer: This is an external link generated by the bot, please verify the link before clicking."
                    {...rest}
                  />
                );
              },
              hr: () => <hr className="my-2 border-gray-300" />,
              br: () => <div className="my-2" />,
            }}
          >
            {message.text}
          </Markdown>
          {message.timestamp && (
            <div
              className={`text-xs mt-2 ${
                message.from === "bot" ? "text-gray-400" : "text-blue-200"
              }`}
            >
              {dayjs(message.timestamp).format("HH:mm")}
            </div>
          )}
        </div>
        {message.from === "user" && (
          <img
            src={avatar}
            alt="User Avatar"
            className="w-8 h-8 rounded-full ml-2"
          />
        )}
      </div>
    );
  }
);

Message.displayName = "Message";
