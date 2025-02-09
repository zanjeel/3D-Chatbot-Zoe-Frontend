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

  useEffect(() => {
    const unlockAudio = () => {
      console.log("👂 Unlocking audio...");
      const audio = audioRef.current;
      if (!audio) return;

      // Replace silence with actual unmuted audio
      audio.src = "/api.mp3"; // Replace with a real audio file
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
  };

  const handlePopupClose = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Play audio only on user interaction
    audio.src = "/api.mp3"; // Replace with a real audio file
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
    <div className="overflow-hidden" style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Preloader */}
      {showPreloader && (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 100 }}>
          <Preloader />
        </div>
      )}

      {/* UI Components */}
      <Leva hidden />
      <UI style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 5 }} />
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 5 }}>
        <ButtonMain isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onToggleBackground={toggleBackground} />
      </div>

      {/* Background */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -10, overflow: "hidden" }}>
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
        <Experience />
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
            }}
          >
            <h2>Welcome!</h2>
            <p>We need your help to unlock audio playback.</p>
            <button onClick={handlePopupClose} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
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
