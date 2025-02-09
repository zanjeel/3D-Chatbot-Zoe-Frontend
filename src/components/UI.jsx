import { useRef, useState, useEffect } from "react"; // Import useEffect
import { useChat } from "../hooks/useChat";

export const UI = ({ hidden,  ...props }) => {
  const input = useRef();
  const { chat, loading, setLoading, message, error, userId } = useChat();
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    if (error[userId]) {  // Error visibility per user
      setIsErrorVisible(true);
      const timer = setTimeout(() => {
        setIsErrorVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, userId]);

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading[userId] && !message) {
      setLoading((prevState) => ({ ...prevState, [userId]: true }));
        // ✅ Set localStorage when user interacts
      chat(text);  // Send message without passing userId, as it's handled in useChat
      input.current.value = "";
      localStorage.setItem("audioUnlocked", "true");
      window.dispatchEvent(new Event("storage")); 
      console.log("localstorage set to true on button click")
    }
  };

  const templateMessages = [
    { text: "Do you judge me?", type: "lifechoices" },
    { text: "How to do life?", type: "overwhelming" }, //how do u keep going
    { text: "I am so done.", type: "sad" },
  ];

  const handleTemplateClick = (messageType) => {
    if (!loading[userId] && !message) {
      setLoading((prevState) => ({ ...prevState, [userId]: true }));
      chat("", messageType);  // Send template message type
      setIsChatVisible(true);
      localStorage.setItem("audioUnlocked", "true");
      window.dispatchEvent(new Event("storage")); 
      console.log("localstorage set to true on button click")
    }
  };

  return (
  <>
    <header className={`backdrop-blur-3xl z-20 transition-all duration-300`}
  >
    {/* Announcement Bar */}
    <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
     <p>&copy; 2025 Zeej AI. All Rights Reserved.</p>
      <div className="inline-flex gap-1 items-center">
        <p className="text-white/60 hidden md:block">Gemini Flash 1.5 x Amazon Polly</p>
        {/* <ArrowRight className="h-4 w-4 inline-flex justify-center items-center" /> */}
      </div>
    </div>
    </header>

    <div className="fixed z-50 inset-0 flex justify-between ">
    {/* Responsive Logo */}
     <div className=" absolute top-4 py-10 lg:py-1 md:top-5 lg:mt-6 xl:mt-9 ml-6 lg:ml-16 flex items-center">
      <img
        src="/logosaas.png"
        alt="SaaS Logo"
        className="w-12 h-12  xl:w-20 xl:h-20 shadow-md transition-all duration-300 
                   hover:scale-110 hover:shadow-lg rounded-full"
      />
      <span className="md:ml-5  mt-1 ml-3 font-sans font-extrabold text-white text-2xl md:text-3xl ">
        Zeej AI
      </span>
     </div>
  

      {/* Question mark button */}
      <div
      className="absolute mt-2 z-50 top-10 right-10 md:right-20 md:top-14  lg:top-10 lg:right-24 xl:top-14 xl:right-28 cursor-pointer rounded-full"
      style={{ backgroundColor: "#1a1a1a", pointerEvents: "auto" }}
      >

      {/* Button */}
      <button
        className="relative hidden md:block overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        onClick={toggleVisibility}
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 text-white backdrop-blur-3xl text-xl font-bold md:px-4 md:py-2 xl:px-6 xl:py-4 md:text-2xl lg:text-2xl xl:text-xl">
          ?
        </span>
      </button>

      {/* Pop-up Box (Visible on Click) */}
      {isVisible && (
        <div
          className="absolute top-16 text-sm md:text-lg lg:text-lg right-2 w-64 p-4 bg-gray-600 text-white rounded-md shadow-lg"
          style={{
            transition: "opacity 0.3s ease-in-out",
            backgroundColor: "#1a1a1a",
          }}
        >
          <p>You can talk to Zeej about anything, she gives the best advice!</p>
        </div>
      )}
    </div>

    <div className="container ">
    {isErrorVisible && (
        <div className="error-box">
          <p>{error[userId]}</p>
        </div>
      )}
    </div>


      {/* Template Message Buttons */}
  <div
  style={{
    position: "absolute",
    bottom: "6.5rem",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "auto",
  }}
>
  {templateMessages.map((msg, index) => (
    <button
      key={index}
      onClick={() => handleTemplateClick(msg.type)}
      className="lg:mb-4 xl:mb-0 -mb-2  relative inline-flex h-18 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="mb-1  inline-flex font-sans font-medium h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-300 px-5 py-2 md:px-10 md:py-4 lg:px-8 lg:py-5 md:text-xl xl:px-7 xl:py-3  text-black backdrop-blur-3xl">
        {msg.text}
      </span>
    </button>
  ))}
</div>

{isChatVisible && (
    <div className="mb-2 md:mb-0 absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-2  p-1   bg-[#1a1a1a] rounded-full shadow-lg border border-[#333] pointer-events-auto w-[90%] max-w-[800px]">

  {/* Input Field */}
  <input
    className="flex-1 bg-transparent border-none text-white text-base sm:text-md md:text-xl pl-7 outline-none"
    placeholder="Hey, what's up..."
    ref={input}
    onKeyDown={(e) => {
      if (e.key === "Enter") sendMessage();
    }}
  />

  {/* Button */}
  <button
    disabled={loading[userId] || message}
    onClick={sendMessage}
    className="relative md:h-16 lg:h-20 xl:h-16 h-16 w-[30%] sm:w-[40%] md:w-[25%] max-w-[180px] 
    overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 
    focus:ring-offset-2 focus:ring-offset-slate-50"
  >
    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] 
    bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />

    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center 
    rounded-full bg-slate-950 px-4 py-2 text-sm  md:text-lg lg:text-xl  md:font-medium text-white backdrop-blur-3xl">
      {loading[userId] || message ? "Sending" : "Send"}
    </span>
  </button>
</div>
)}
    </div>

    </>
  );
};
