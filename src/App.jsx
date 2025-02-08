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
  // State to handle popup visibility after preloader
  const [showPopup, setShowPopup] = useState(false);
  // State to toggle backgrounds
  const [isGradientBg, setIsGradientBg] = useState(true);
  // State to toggle dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  const audioRef = useRef(new Audio("/silence.mp3"));

  useEffect(() => {
    const unlockAudio = () => {
      console.log("👂 Unlocking audio...");
      const audio = audioRef.current;
      audio.volume = 0;
      audio.play()
        .then(() => {
          localStorage.setItem("audioUnlocked", "true");
          console.log("🔓 Autoplay Unlocked!");
        })
        .catch(err => console.error("⚠️ Playback error:", err));

      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };

    if (!localStorage.getItem("audioUnlocked")) {
      // console.log("🔒 Waiting for user interaction to unlock audio...");
      window.addEventListener("click", unlockAudio, { once: true });
      window.addEventListener("keydown", unlockAudio, { once: true });
      window.addEventListener("touchstart", unlockAudio, { once: true });
    } else {
      console.log("🔓 Audio already unlocked, autoplay enabled.");
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowPreloader(false);
      if (!localStorage.getItem("audioUnlocked")) {
        setShowPopup(true);
      }
    }, 2000);
  }, []);

  const toggleBackground = () => {
    setIsGradientBg(!isGradientBg);
  };

  const handlePopupClose = () => {
    audio.volume = 0;
    audioRef.current.play().catch(err => console.error("Playback error:", err));
    audio.play().catch(err => console.error("Playback error:", err));
    setShowPopup(false);
    localStorage.setItem("audioUnlocked", "true");
  };

  return (
    <div className="overflow-hidden" style={{ position: "relative", height: "100vh", width: "100vw", }}>
      {/* Render preloader until showPreloader is false */}
      {showPreloader && (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 100 }}>
          <Preloader />
        </div>
      )}

      {/* Main content */}
      <Leva hidden />
      <UI style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 5 }} />
      <div  style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 5 }} >
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
          overflow:"hidden",
          zIndex: -1,
        }}
      >
        <Experience  />
      </Canvas>

      {/* Popup Modal */}
      {showPopup && (
        <>
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000 }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)", zIndex: 1001 }}>
            <h2>Welcome!</h2>
            <p>We need your help to unlock audio playback.</p>
            <button onClick={handlePopupClose} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>OK</button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
