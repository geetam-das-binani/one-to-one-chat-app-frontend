import React, { useEffect, useRef, useState } from "react";
import "./Chats.css";
import { io } from "socket.io-client";
import { useStateValue } from "./Context";
import toast, { Toaster } from "react-hot-toast";
import Button from "@mui/material/Button";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import ScrollableChats from "./ScrollableChats/ScrollableChats";

// Initialize socket variable
let socket;

const Chats = () => {
  const [val, setVal] = useState("");

  const [messages, setMessages] = useState([]);

  const [userSocketId, setUserSocketId] = useState("");

  // Destructure user from context
  const { user } = useStateValue();

  // Reference for the last message to scroll into view
  const lastMessageRef = useRef(null);

  const sendMessage = (e) => {
    e.preventDefault();
    // Check if the message is not empty
    if (!val) {
      toast.error("Please enter something");
      return;
    }

    // Create message object
    const msgObj = {
      id: userSocketId,
      name: user.name,
      message: val,
      pic: user.pic,
      time: `${new Date(Date.now()).getHours()}:${new Date(
        Date.now()
      ).getMinutes()}`,
    };

    // Emit the message to the server
    socket.emit("message", msgObj);

    setVal("");
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

        {/* Form for sending messages */}
        <form className="msger-inputarea">
          <input
            type="text"
            className="msger-input"
            placeholder="Enter your message..."
            value={val}
            onChange={({ target }) => setVal(target.value)}
          />
          <button
            onClick={sendMessage}
            type="submit"
            className="msger-send-btn"
          >
            Send
          </button>
        </form>

        {/* Toast notification component */}
        <Toaster />
      </section>
    </div>
  );
};

export default Chats;
