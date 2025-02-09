import { useEffect, useRef } from "react";
import gsap from "gsap";

const Preloader = () => {
  const loadingRef = useRef(null);
  const logoNameRef = useRef(null);

  useEffect(() => {
    // GSAP animations
    gsap.fromTo(
      loadingRef.current,
      { opacity: 1 },
      {
        opacity: 0,
        display: "none",
        duration: 1.5,
        delay: 3.5,
      }
    );

    gsap.fromTo(
      logoNameRef.current,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 2,
        delay: 1,
      }
    );
  }, []);

  return (
    <div ref={loadingRef} className="loading-page flex flex-col items-center justify-center">
      <svg id="Flat" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <path
          d="M197.00781,132.74023l-52.16015-19.21777a3.99186,3.99186,0,0,1-2.3711-2.37012L123.25977,58.99219a11.99948,11.99948,0,0,0-22.51954,0L81.52246,111.15234a3.99186,3.99186,0,0,1-2.37012,2.3711L26.99219,132.74023a11.99948,11.99948,0,0,0,0,22.51954l52.16015,19.21777a3.99186,3.99186,0,0,1,2.3711,2.37012l19.21679,52.16015a11.99948,11.99948,0,0,0,22.51954,0l19.21679-52.16015h.001a3.99186,3.99186,0,0,1,2.37012-2.3711l52.16015-19.21679a11.99948,11.99948,0,0,0,0-22.51954Zm-2.76562,15.01368L142.082,166.96973a11.98076,11.98076,0,0,0-7.11133,7.1123l-19.21679,52.16016a4.00076,4.00076,0,0,1-7.50782,0L89.03027,174.082a11.98076,11.98076,0,0,0-7.1123-7.11133L29.75781,147.75391a4.00076,4.00076,0,0,1,0-7.50782L81.918,121.03027a11.98076,11.98076,0,0,0,7.11133-7.1123l19.21679-52.16016a4.00076,4.00076,0,0,1,7.50782,0L134.96973,113.918a11.98076,11.98076,0,0,0,7.1123,7.11133l52.16016,19.21679a4.00076,4.00076,0,0,1,0,7.50782ZM148,40a4.0002,4.0002,0,0,1,4-4h20V16a4,4,0,0,1,8,0V36h20a4,4,0,0,1,0,8H180V64a4,4,0,0,1-8,0V44H152A4.0002,4.0002,0,0,1,148,40Zm96,48a4.0002,4.0002,0,0,1-4,4H228v12a4,4,0,0,1-8,0V92H208a4,4,0,0,1,0-8h12V72a4,4,0,0,1,8,0V84h12A4.0002,4.0002,0,0,1,244,88Z"
        />
      </svg>

      <div className="mt-8 h-12 overflow-hidden flex justify-center">
        <div
          ref={logoNameRef}
          className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wide sm:tracking-widest uppercase font-bold px-4 text-center"
        >
        Zeej Ai
        </div>
      </div>


    </div>
  );
};

export default Preloader;
