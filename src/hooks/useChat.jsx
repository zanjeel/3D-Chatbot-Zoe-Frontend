import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [messageType, setMessageType] = useState(null);
  const [error, setError] = useState(null); // Add error state
  const [queryCount, setQueryCount] = useState(0); // Track number of queries

  // Auto-dismiss error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [error]);

  const chat = async (message, messageType = null) => {
    // Check if query limit is reached
    if (queryCount >= 25) {
      setError("Chat Limit Reached");
      return;
    }

    setLoading(true);
    setError(null); // Clear any previous error
    try {
      console.log("Sending request to backend with:", { message, messageType });
      const data = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, messageType }),
      });

      if (!data.ok) {
        // Handle rate limit errors
        if (data.status === 429) {
          throw new Error("Server request overload. Try again later.");
        } else {
          throw new Error(`HTTP error! Status: ${data.status}`);
        }
      }

      const resp = await data.json();

      // Handle error response from backend
      if (resp.error) {
        setError(resp.error);
        return;
      }

      console.log("Received response from backend:", resp.messages);
      setMessages((messages) => [...messages, ...resp.messages]);

      // Increment query count
      setQueryCount((count) => count + 1);
    } catch (error) {
      console.error("Error in chat function:", error);
      setError(error.message); // Display the error message
    } finally {
      setLoading(false);
    }
  };

  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        messageType,
        setMessageType,
        error, // Expose error state
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};