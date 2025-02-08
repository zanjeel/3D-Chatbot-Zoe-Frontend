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
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState({});
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [messageType, setMessageType] = useState(null);
  const [error, setError] = useState({});
  const [queryCount, setQueryCount] = useState({});

    // 🔹 Load initial interaction state from localStorage
  const [hasInteracted, setHasInteracted] = useState(
    localStorage.getItem("audioUnlocked") === "true"
  );


  useEffect(() => {
    if (hasInteracted) {
      localStorage.setItem("audioUnlocked", "true");
    }
  }, [hasInteracted]);

  // Get or generate the unique user ID (session ID)
  let userId = sessionStorage.getItem("userId");
  if (!userId) {
    userId = generateUniqueSessionId();
    sessionStorage.setItem("userId", userId);
  }

  useEffect(() => {
    if (error[userId]) {
      const timer = setTimeout(() => {
        setError((prev) => ({ ...prev, [userId]: null }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, userId]);

  useEffect(() => {
    const resetQueryCount = () => {
      setQueryCount((prevCounts) => ({
        ...prevCounts,
        [userId]: 0, // Reset only the current user's count
      }));
    };
  
    const timer = setTimeout(resetQueryCount, 24 * 60 * 60 * 1000); // Reset after 24 hours
  
    return () => clearTimeout(timer); // Cleanup when component unmounts
  }, [userId]);

  const chat = async (message,  messageType = null) => {

    if (loading[userId]) return;
    
    if ((queryCount[userId] || 0) >= 25) {
      setError((prev) => ({ ...prev, [userId]: "Chat Limit Reached" }));
      return;
    }

    // Set loading state for the user
    setLoading((prevState) => ({...prevState,[userId]: true,}));

    setError((prev) => ({ ...prev, [userId]: null })); // Reset error for this user

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
        setError((prev) => ({ ...prev, [userId]: resp.error || `Server Overload, Try again Later :( (Status: ${response.status})` }));
        throw new Error(resp.error || `Server Overload, Try again Later :( (Status: ${response.status}) `);
      }

      if (resp.error) {
        setError((prev) => ({ ...prev, [userId]: resp.error }));
        return;
      }

      console.log("useChat.jsx: Received response from backend:", resp.messages);
      
         // Update messages per user
      setMessages((prevMessages) => ({...prevMessages,
        [userId]: [...(prevMessages[userId] || []), ...resp.messages],
      }));

      // ✅ Increment queryCount **only if request is successful**
      setQueryCount((prevCounts) => ({
        ...prevCounts,
        [userId]: (prevCounts[userId] || 0) + 1,
      }));
    } catch (err) {
      setError((prev) => ({ ...prev, [userId]: err.message })); // Set error for this user
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false })); // ✅ Ensure only this user's loading state is reset
    }
  };

    const onMessagePlayed = () => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [userId]: prevMessages[userId]?.slice(1) || [],  // Remove first message for the current user
      }));
    };
    
  useEffect(() => {
    if (messages[userId]?.length > 0) {
      setMessage(messages[userId][0]);  // Set the first message for the current user
    } else {
      setMessage(null);  // No messages for this user
    }
  }, [messages, userId]);  // Add userId as dependency to re-run effect for each user


  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        setLoading,
        cameraZoomed,
        setCameraZoomed,
        messageType,
        setMessageType,
        error,
        userId,
        hasInteracted,
        setHasInteracted, // Make setHasInteracted accessible in UI.jsx
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
