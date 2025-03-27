"use client";
import { useEffect, useState, useRef } from "react";
import { Avatar, IconButton } from "@mui/material";
import {
  Send,
  EmojiEmotions,
  AttachFile,
  Mic,
  MoreVert,
} from "@mui/icons-material";
import * as message_api from "../network/message_api";
import { getSocket } from "../network/user_api"; // Import socket from user_api
import { User } from "../models/user";
import { Message } from "../models/messages";
import Image from "next/image";
import { io } from "socket.io-client";

export default function ChatApp() {
  const [userForSideBar, setUserForSideBar] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null); // Ref for auto-scroll
  // const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const socketRef = useRef(io("http://localhost:5000"));

  useEffect(() => {
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("receive_message", (newMessage: Message) => {
      console.log("📩 New message received:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]); // ✅ Append to messages state
    });

    return () => {
      socket.off("receive_message"); // ✅ Cleanup event listener
      socket.disconnect();
    };
  }, []); // ✅ Use an empty dependency array to avoid re-creating listeners

  useEffect(() => {
    // Fetch users for sidebar
    async function fetchUsers() {
      try {
        const users = await message_api.getUsersForSidebar();
        if (Array.isArray(users)) setUserForSideBar(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    async function fetchMessages() {
      try {
        const response = await message_api.getMessages(selectedUser!._id);
        setMessages(response);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
    fetchMessages();
  }, [selectedUser]);

  // // Connect to socket and listen for messages
  // useEffect(() => {
  //   if (!selectedUser) return;

  //   socketRef.current = socket;

  //   console.log("🔌 Socket connected with ID:", socket!.id);

  //   const handleReceiveMessage = (newMessage: Message) => {
  //     console.log("📩 New message received from socket:", newMessage);
  //     setMessages((prevMessages) => [...prevMessages, newMessage]);
  //   };

  //   socket!.on("receive_message", handleReceiveMessage);

  //   return () => {
  //     socket!.off("receive_message", handleReceiveMessage);
  //   };
  // }, [selectedUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle message sending

  const handleSendMessage = async () => {
    if (!selectedUser || !content.trim()) return;

    try {
      const newMessage = await message_api.sendMessage(
        selectedUser._id,
        content
      );

      if (socketRef.current) {
        console.log("📤 Emitting message to server:", newMessage);
        socketRef.current.emit("send_message", newMessage); // ✅ Send full message object
      }

      setMessages((prevMessages) => [...prevMessages, newMessage]); // ✅ Add to local state
      setContent(""); // ✅ Clear input
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-20 bg-gray-800 flex flex-col items-center p-2 space-y-4">
        {userForSideBar?.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full px-2 py-1 rounded-lg ${
              selectedUser?._id === user._id
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            <Avatar src={user?.userInformation?.imageUrl || ""} />
            <p className="text-xs font-semibold">
              {user?.username || "Unknown"}
            </p>
          </button>
        ))}
      </div>

      {/* Main Chat */}
      <div className="flex flex-col flex-1 bg-gray-850 p-4">
        {/* Chat Header */}
        <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
          <h2 className="text-lg font-semibold">
            {selectedUser
              ? `Chat with ${selectedUser.username}`
              : "Select a user"}
          </h2>
          <IconButton>
            <MoreVert className="text-white" />
          </IconButton>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={msg._id || index} // Use _id if available, otherwise fallback to index
                className={`flex ${
                  msg.senderId === selectedUser?._id
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <div className="max-w-xs bg-gray-700 p-2 rounded-lg shadow-md">
                  <p className="text-white">{msg.content}</p>
                  {msg.imageUrl && (
                    <Image
                      src={msg.imageUrl}
                      height={200}
                      width={200}
                      alt="Message"
                    />
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No messages yet.</p>
          )}
          <div ref={chatEndRef} /> {/* Auto-scroll anchor */}
        </div>

        {/* Input Box */}
        <div className="flex items-center bg-gray-800 p-3 rounded-lg">
          <IconButton>
            <EmojiEmotions className="text-yellow-400" />
          </IconButton>
          <IconButton>
            <AttachFile className="text-gray-400" />
          </IconButton>
          <input
            type="text"
            className="flex-1 bg-transparent text-white px-3 outline-none"
            placeholder="Message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <IconButton onClick={handleSendMessage}>
            <Send className="text-blue-400" />
          </IconButton>
          <IconButton>
            <Mic className="text-gray-400" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
