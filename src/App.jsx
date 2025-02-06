import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const toggleBackground = () => {
    setIsGradientBg(!isGradientBg);
  };

  return (
    <div className="overflow-hidden" style={{ position: "relative", height: "100vh", width: "100vw", }}>
      {/* Render preloader until showPreloader is false */}
      {showPreloader && (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10 }}>
          <Preloader />
        </div>
      )}

      {/* Main content */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 2 }}>
        <Leva hidden />
        <UI />
        <div >
          <ButtonMain isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onToggleBackground={toggleBackground} />
        </div>
      </div>

      {/* Background component behind the canvas (ONLY HERE) */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, overflow: "hidden" }}>
        {isGradientBg ? <BackgroundGradientAnimation /> : <WavyBackground />}
      </div>

      {/* Canvas overlaying the background */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 1], fov: 30 }}
        className="canvas-overlay"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
        }}
      >
        <Experience />
      </Canvas>
    </div>
  );
};

export default App;
