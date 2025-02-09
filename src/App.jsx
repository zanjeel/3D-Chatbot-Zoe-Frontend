import React, { useState, useEffect, useRef } from "react";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import ButtonMain from "./components/ButtonMain";
import Preloader from "./components/Preloader";
import { BackgroundGradientAnimation } from "./components/BackgroundGradientAnimation";
import { WavyBackground } from "./components/WavyBackground";

const App = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [isGradientBg, setIsGradientBg] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const audioRef = useRef(null);
  const [dotColor, setDotColor]= useState("black");

  useEffect(() => {
    // Disable scroll on mount
    const disableScroll = () => {
      document.body.style.overflow = "hidden";
    };
    
    disableScroll(); // Disable scroll when the app loads

    // Optionally, enable scroll later, e.g., on a button click or after an event
    // enableScroll();

    return () => {
      document.body.style.overflow = ""; // Cleanup when component is unmounted
    };
  }, []);

  useEffect(() => {
    // Change background based on the isGradientBg state
    if (isGradientBg) {
      document.body.style.backgroundImage = "linear-gradient(0deg, #aaa7a7 40%, #463889 90%)";
    } else {
      document.body.style.backgroundImage = "black"; // Clear the background if not gradient
      document.body.style.backgroundColor = "black"; // Or set a solid background color
    }
  }, [isGradientBg]); // This will run whenever isGradientBg changes
  

  useEffect(() => {
    const unlockAudio = () => {
      console.log("👂 Unlocking audio...");
      const audio = audioRef.current;
      if (!audio) return;

      // Replace silence with actual unmuted audio
      audio.src = "/button-push.mp3"; // Replace with a real audio file
      audio.volume = 1; // Unmute and set volume to max
      audio.play()
        .then(() => {
          console.log("✅ Audio unlocked!");
          localStorage.setItem("audioUnlocked", "true");
        })
        .catch(err => console.error("⚠️ Playback error:", err));

      // Remove listeners after unlocking audio
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };

    if (!localStorage.getItem("audioUnlocked")) {
      console.log("🔒 Waiting for user interaction to unlock audio...");
      window.addEventListener("click", unlockAudio, { once: true });
      window.addEventListener("keydown", unlockAudio, { once: true });
      window.addEventListener("touchstart", unlockAudio, { once: true });
    } else {
      console.log("🔓 Audio already unlocked.");
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowPreloader(false);
      console.log(" Showing popup for audio permission");
      setShowPopup(true);
    }, 5000);
  }, []);

  const toggleBackground = () => {
    setIsGradientBg(!isGradientBg);
    setDotColor(isGradientBg ? "black" : "white");
  };

  const handlePopupClose = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Play audio only on user interaction
    audio.src = "/button-push.mp3"; // Replace with a real audio file
    audio.volume = 1; // Unmute and set volume to max

    audio.play()
      .then(() => {
        console.log("✅ Audio unlocked via popup");
        localStorage.setItem("audioUnlocked", "true");
        setShowPopup(false);
      })
      .catch(err => console.error("⚠️ Playback error:", err));
  };

  return (
    <div className="overflow-hidden" 
    style={{ position: "relative", height: "100vh", width: "100vw", 
     
    }}
    >
      {/* Preloader */}
      {showPreloader && (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10000000000 }}>
          <Preloader />
        </div>
      )}

      {/* UI Components */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 50 }}>
      <Leva hidden />
      <UI  /> 
      <ButtonMain isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onToggleBackground={toggleBackground} />
      </div>

      {/* Background */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1, overflow: "hidden" }}>
        {isGradientBg ? <BackgroundGradientAnimation /> : <WavyBackground />}
      </div>

      {/* Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 1], fov: 30 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflow: "hidden",
          zIndex: -1,
        }}
      >
        <Experience
          dotColor={dotColor} 
          shadows
          style={{
            overflow: "hidden",
          }} />
      </Canvas>

      {/* Audio Unlock Popup */}
      {showPopup && (
        <>
          {/* Semi-transparent overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
              pointerEvents: "auto",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              zIndex: 1001,
              pointerEvents: "auto",
              display: "flex",               // Add flexbox to center content
              flexDirection: "column",       // Stack items vertically
              justifyContent: "center",     // Vertically center content
              alignItems: "center",         // Horizontally center content
              textAlign: "center",  
            }}
          >
            <p className="items-center justify-center mb-4">Click To Allow Audio</p>
            <button onClick={handlePopupClose} 
            className="rounded-lg bg-black text-white items-center justify-center"
            style=
            {{ padding: "10px 20px", 
            fontSize: "16px",
            cursor: "pointer" 
            }}>
              OK
            </button>
          </div>
        </>
      )}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />
    </div>
  );
};

export default App;
