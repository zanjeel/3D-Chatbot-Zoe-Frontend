import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_API_URL;
// const backendUrl = "http://localhost:3000";
// Function to generate a unique session ID
function generateUniqueSessionId() {
  const timestamp = Date.now(); // Current timestamp
  const randomValue = Math.random().toString(36).substring(2, 15); // Random alphanumeric string
  const uniqueId = `${timestamp}-${randomValue}`; // Combine both to create a unique ID
  return uniqueId;
}

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [messageType, setMessageType] = useState(null);
  const [error, setError] = useState(null);
  const [queryCount, setQueryCount] = useState(0);

  // Get or generate the unique user ID (session ID)
  let userId = sessionStorage.getItem("userId");
  if (!userId) {
    userId = generateUniqueSessionId();
    sessionStorage.setItem("userId", userId);
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const chat = async (message, messageType = null) => {
    
    if (queryCount >= 25) {
      setError("Chat Limit Reached");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Sending request to backend with:", { message, messageType, userId });

      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, messageType, userId }), // Send userId along with message
      });

      const resp = await response.json(); // ✅ Parse response first

      if (!response.ok) {
        console.error("Error in response:", response);
        // console.log("backendUrl", { backendUrl });
        setError(resp.error || `Server Overload, Try again Later :( (Status: ${response.status})`);
        throw new Error(resp.error || `Server Overload, Try again Later :( (Status: ${response.status}) `);
      }

      if (resp.error) {
        setError(resp.error);
        return;
      }

      console.log("useChat.jsx: Received response from backend:", resp.messages);
      setMessages((messages) => [...messages, ...resp.messages]);

      setQueryCount((count) => count + 1);
    } catch (error) {
      console.error("useChat.jsx: Error in chat function:", error);
      setError(error.message);
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
        error,
        userId,
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
