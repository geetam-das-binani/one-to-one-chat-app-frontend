import React, { useEffect, useRef, useState } from "react";
import "./Chats.css";
import { io } from "socket.io-client";
import { useStateValue } from "./Context";
import toast, { Toaster } from "react-hot-toast";
import Button from "@mui/material/Button";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import ScrollableChats from "./ScrollableChats/ScrollableChats";
import Lottie from "react-lottie";

import animationData from "../src/animations/typing.json";
// Initialize socket variable
let socket;
const defaultOptions = {
  loop: true,
  autoPlay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const Chats = () => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  const [userSocketId, setUserSocketId] = useState("");

  // Destructure user from context
  const { user } = useStateValue();

  // Reference for the last message to scroll into view
  const lastMessageRef = useRef(null);

  const sendMessage = (e) => {
    e.preventDefault();

    // Create message object
    if (newMessage) {
      // Create message object
      const msgObj = {
        id: userSocketId,
        name: user.name,
        message: newMessage,
        pic: user.pic,
        time: `${new Date(Date.now()).getHours()}:${new Date(
          Date.now()
        ).getMinutes()}`,
      };

      // Emit the message to the server
      socket.emit("message", msgObj);

      // Clear the input field after sending the message
      setNewMessage("");
      socket.emit("stop typing");
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (e.target.value && userSocketId) {
      socket.emit("typing");
    } else {
     
      socket.emit("stop typing");
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && isTyping) {
        setIsTyping(false);
        socket.emit("stop typing");
      } 
      else {
        socket.emit("stop typing");
      }
    }, timerLength);
  };

  // Function to handle user logout
  const handleLogout = () => {
    signOut(auth);
  };

  // useEffect for initializing the socket connection and event listeners
  useEffect(() => {
    // Connect to the socket server
    socket = io("http://localhost:3000");

    // Event listener for connection
    socket.on("connect", () => {
      // Emit 'joined' event with user information
      socket.emit("joined", { user });

      // Set user's socket ID in state
      setUserSocketId(socket.id);
    });

    // Event listener for new user joined
    socket.on("new-user", (data) => {
      // Display toast notification for the new user
      toast.success(` ${data.user.name} has joined the chat`, {
        duration: 4000,
      });
    });

    // Event listener for received message
    socket.on("received_message", (data) => {
      // Update messages state with the new message
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup function to disconnect socket when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, []);

  // useEffect to scroll to the last message when new messages are received
  useEffect(() => {
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    lastMessageRef.current?.scrollIntoView();
    // The scrollIntoView() method scrolls an element into the visible area of the browser window.
  }, [messages]); // Run this effect when messages state changes

 
  return (
    <div>
      {/* Logout button */}
      <Button
        className="logout__btn"
        variant="contained"
        sx={{
          background: "red",
          ":hover": {
            backgroundColor: "red",
            boxShadow: "none",
            color: "#000000",
          },
        }}
        onClick={handleLogout}
      >
        Logout
      </Button>

      {/* Chat section */}
      <section className="msger">
        {/* Chat header */}
        <header className="msger-header">
          <div className="msger-header-title">
            <i className="fas fa-comment-alt"></i> WeChat
          </div>
          <div className="msger-header-options">
            <span>
              <i className="fas fa-cog"></i>
            </span>
          </div>
        </header>

        {/* Chat messages */}
        <main className="msger-chat">
          {/* Map through messages and display them */}
          {messages?.map((msg, i) => (
            <ScrollableChats
              isOriginalSender={msg.id === userSocketId}
              {...msg}
              key={i}
            />
          ))}
          {/* Ref for the last message to scroll into view */}
          <div ref={lastMessageRef}></div>
        </main>

        {isTyping && (
          <div>
            <Lottie
                options={defaultOptions}
               width={70}
               style={{
                marginRight:"15px",
                marginLeft:"0px",
                padding:".2rem",
                background:"transparent"
               }}
               
                
               
              
            />
          </div>
        )}
        {/* Form for sending messages */}
        <form className="msger-inputarea" onSubmit={sendMessage}>
          <input
            type="text"
            className="msger-input"
            placeholder="Enter your message..."
            value={newMessage}
            onChange={typingHandler}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                sendMessage(e);
              }
            }}
          />
        </form>

        {/* Toast notification component */}
        <Toaster />
      </section>
    </div>
  );
};

export default Chats;
