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
  // State to handle preloader visibility
  const [showPreloader, setShowPreloader] = useState(true);
  // State to toggle backgrounds
  const [isGradientBg, setIsGradientBg] = useState(true);
  // State to toggle dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    // The effect is only concerned with initial preloading, no need to manage clicks here
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const toggleBackground = () => {
    setIsGradientBg(!isGradientBg);
  };

  // Handle Popup close and unlock audio
  const handlePopupClose = () => {
    setShowPopup(false); // Close the popup
    localStorage.setItem("audioUnlocked", "true"); // Unlock audio on popup close

    const audio = audioRef.current;
    audio.volume = 0; // Silent
    audio.src = "/silent.mp3";
    console.log("🎧 Audio source set:", audio.src);

    audio.play()
      .then(() => {
        console.log("✅ Audio play triggered");
      })
      .catch(err => console.error("⚠️ Playback error:", err));
  };

  return (
    <div className="overflow-hidden" style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Render preloader until showPreloader is false */}
      {showPreloader && (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 100 }}>
          <Preloader />
        </div>
      )}

      {/* Main content */}
      <Leva hidden />
      <UI style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 5 }} />
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 5 }}>
        <ButtonMain isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onToggleBackground={toggleBackground} />
      </div>

      {/* Background component behind the canvas (ONLY HERE) */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -10, overflow: "hidden" }}>
        {isGradientBg ? <BackgroundGradientAnimation /> : <WavyBackground />}
      </div>

      {/* Canvas overlaying the background */}
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
        <Experience />
      </Canvas>

      {/* Popup Modal */}
      {showPopup && (
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
            zIndex: 1000,
          }}
        >
          <h2>Welcome!</h2>
          <p>We need your help to unlock audio playback.</p>
          <button
            onClick={handlePopupClose}
            style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
