import React, { useRef, useEffect } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

const ButtonMain = ({ isDarkMode, setIsDarkMode, onToggleBackground }) => {
  const ref= useRef();
  useEffect(() => {
    if (ref.current) {
        ref.current.style.backgroundColor = isDarkMode ? "#020617" : "white"; 

    }
  }, [isDarkMode]); // Runs when isDarkMode changes

  return (
    <div className="absolute  right-0 md:right-20  cursor-pointer rounded-full group">
     <div
        className="absolute -mt-1 md:mt-2 top-10 right-10 cursor-pointer rounded-full group "
        style={{ backgroundColor: "#1a1a1a", zIndex: "2147483647", pointerEvents: "auto" }}
        >
      <button
        className="relative inline-flex overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        onClick={onToggleBackground}
        style={{
          width: "65px",
          height: "65px",
          position: "relative",
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
    <span ref={ref} className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full   backdrop-blur-3xl">
  

        {/* Toggle Icon (Dark Mode Switch) */}
        <span
          className="relative z-10"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DarkModeSwitch checked={isDarkMode} onChange={setIsDarkMode} size={30} />
        </span>
    </span>
      </button>
      </div>
    </div>
  );
};

export default ButtonMain;
