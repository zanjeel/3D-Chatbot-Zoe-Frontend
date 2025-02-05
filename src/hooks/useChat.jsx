import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_API_URL;

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [messageType, setMessageType] = useState(null);
  const [error, setError] = useState(null);
  const [queryCount, setQueryCount] = useState(0);

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
      console.log("Sending request to backend with:", { message, messageType });

      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, messageType }),
      });

      const resp = await response.json(); // ✅ Parse response first

      if (!response.ok) {
        console.log("backendUrl", {backendUrl});
        setError(resp.error || `Server Overload, Try again Later :( (Status: ${response.status})`);
        throw new Error(resp.error || `Server Overload, Try again Later :( `);
      }

      if (resp.error) {
        setError(resp.error);
        return;
      }

      console.log("Received response from backend:", resp.messages);
      setMessages((messages) => [...messages, ...resp.messages]);

      setQueryCount((count) => count + 1);
    } catch (error) {
      console.error("Error in chat function:", error);
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
