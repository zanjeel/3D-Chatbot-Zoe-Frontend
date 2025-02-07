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
    <div className="absolute right-6 top-14 md:top-16 lg:top-12 lg:right-10 xl:top-16 overflow-hidden  cursor-pointer rounded-full group">
     <div
        className="  top-4  cursor-pointer rounded-full group "
        style={{ backgroundColor: "#1a1a1a", pointerEvents: "auto" }}
        >
      <button
        className=" w-12 h-12 xl:h-14 xl:w-14 inline-flex overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        onClick={onToggleBackground}
        style={{
          position: "relative",
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
    <span ref={ref} className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full font-bold md:px-6 md:py-4 xl:px-7 xl:py-4  backdrop-blur-3xl">
  

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
