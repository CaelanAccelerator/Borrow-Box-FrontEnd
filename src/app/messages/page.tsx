"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  TextField,
  IconButton,
  Paper
} from "@mui/material";
import { Send as SendIcon, Search as SearchIcon } from "@mui/icons-material";
import { isLoggedIn } from "@/utils/auth";
import { useRouter } from "next/navigation";

const socketUrl = "http://localhost:3005/chatting"; 

// Mock data for testing
const mockChats = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "When can I pick up the camera?",
    timestamp: "10:30 AM",
    avatar: "/avatars/user1.jpg",
    unread: 2
  },
  {
    id: 2,
    name: "Jane Smith",
    lastMessage: "The laptop works great, thanks!",
    timestamp: "Yesterday",
    avatar: "/avatars/user2.jpg",
    unread: 0
  }
];

interface Message {
  chatId: number;
  sender: string;
  content: string;
  timestamp: string;
}

export default function Home() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const router = useRouter();

   useEffect(() => {
      if (!isLoggedIn()) {
        alert('Please log in to access this page');
        router.push('/'); // Redirect to home instead of login
      }
    }, [router]);

  useEffect(() => {
    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSend = () => {
    if (selectedChat && messageInput.trim()) {
      const msg: Message = {
        chatId: selectedChat,
        sender: "Me", // 可替换为真实用户名
        content: messageInput,
        timestamp: new Date().toLocaleTimeString(),
      };
      if (socketRef.current) {
        socketRef.current.emit("message", msg);
      }
      setMessages((prev) => [...prev, msg]);
      setMessageInput("");
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Box sx={{
          display: 'flex',
          height: 'calc(100vh - 100px)',
          gap: 2,
          p: 2
        }}>
          {/* Left Column - Chat List */}
          <Paper sx={{
            width: 320,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Search Bar */}
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search messages..."
              />
            </Box>

            <Divider />

            {/* Chat List */}
            <List sx={{ flex: 1, overflow: 'auto' }}>
              {mockChats.map((chat) => (
                <ListItem
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                    bgcolor: selectedChat === chat.id ? 'action.selected' : 'inherit'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={chat.avatar} alt={chat.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">{chat.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {chat.timestamp}
                        </Typography>
                      </Box>
                    }
                    secondary={chat.lastMessage}
                  />
                  {chat.unread > 0 && (
                    <Box
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        minWidth: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        ml: 1,
                      }}
                    >
                      <Typography variant="caption">{chat.unread}</Typography>
                    </Box>
                  )}
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Right Column - Chat Window */}
          <Paper sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 2
          }}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <Box sx={{ pb: 2 }}>
                  <Typography variant="h6">
                    {mockChats.find(chat => chat.id === selectedChat)?.name}
                  </Typography>
                </Box>

                <Divider />

                {/* Messages Area */}
                <Box sx={{
                  flex: 1,
                  overflow: 'auto',
                  my: 2
                }}>
                  {messages
                    .filter(msg => msg.chatId === selectedChat)
                    .map((msg, idx) => (
                      <Box key={idx} sx={{ mb: 1 }}>
                        <Typography variant="body2" color={msg.sender === "Me" ? "primary" : "text.secondary"}>
                          {msg.sender}: {msg.content}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {msg.timestamp}
                        </Typography>
                      </Box>
                    ))}
                </Box>

                {/* Message Input */}
                <Box sx={{
                  display: 'flex',
                  gap: 1
                }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSend();
                    }}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSend}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}>
                <Typography color="text.secondary">
                  Select a chat to start messaging
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </main>
    </div>
  );
}
