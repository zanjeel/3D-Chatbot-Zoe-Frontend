import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
  OrbitControls,
  Sparkles
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { Model } from "./Model";
import { ClipLoader } from 'react-spinners';

const Dots = ({dotColor, ...props}) => {
  const { loading, userId } = useChat();
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    if (loading[userId]) {
      const interval = setInterval(() => {
        setLoadingText((loadingText) => {
          if (loadingText.length > 2) {
            return ".";
          }
          return loadingText + ".";
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingText("");
    }
  }, [loading, userId]);

  if (!loading[userId])return null;
  return (
    <group {...props}>
      <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
        {loadingText}
        <meshBasicMaterial attach="material" color={dotColor} />
      </Text>
    </group>
  );
};

export const Experience = ({dotColor}) => {
  const cameraControls = useRef();
  const { cameraZoomed } = useChat();

  useEffect(() => {
    // Increased Z value for a more zoomed-out default view
    cameraControls.current.setLookAt(0, 3, 7, 0, 2, 0);
  }, []);
  
  useEffect(() => {
    if (cameraZoomed) {
      // Slight zoom-in for focus
      cameraControls.current.setLookAt(0, 1.5, 2, 0, 1.5, 0, true);
    } else {
      // Further zoomed-out view for better scene visibility
      cameraControls.current.setLookAt(0, 3, 8, 0, 2, 0, true);
    }
  }, [cameraZoomed]);

  return (
    <>
      <CameraControls ref={cameraControls}
        minDistance={1.5}  // Allows closer zoom but not too close
        maxDistance={4}   // Allows more zooming out
        smoothTime={0.5}   // Smooth movement
        zoomSpeed={1.2}    // Slightly faster zooming
        maxPolarAngle={Math.PI / 2.1} // Limit vertical rotation (reduce extreme up/down view)
        minPolarAngle={Math.PI / 2.1}
        minAzimuthAngle={-0.1} // Limit left horizontal rotation
        maxAzimuthAngle={0.1}
         />
      <Environment preset="sunset" />

      {/* Wrapping Dots into Suspense to prevent Blink when Troika/Font is loaded */}
      <Suspense>
        <Dots position-y={1.75} position-x={-0.02} dotColor={dotColor} />
      </Suspense>
      <Sparkles count={1000} size={10} position={[-10, 1, 0]} scale={[100,100,100]} speed={0.9} />
      <Model />
      <ContactShadows opacity={0.7} />
    </>
  );
};