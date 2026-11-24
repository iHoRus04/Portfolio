"use client";

import { useEffect, useState } from "react";

const ROLES = ["FULLSTACK DEVELOPER", "FRONTEND DEVELOPER"];

export default function TypewriterRole() {
  const [displayText, setDisplayText] = useState("FULLSTACK DEVELOPER");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing phase
      if (displayText.length < currentRole.length) {
        timer = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        }, 85);
      } else {
        // Word complete: pause to let user read
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      // Deleting phase
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length - 1));
        }, 38);
      } else {
        // Word deleted: short pause then switch to next word
        timer = setTimeout(() => {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }, 350);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <span
      className="inline-flex items-center min-h-[1.4em] select-none"
      translate="no"
    >
      <span className="font-mono tracking-wider  text-[#ff2200] font-black">
        {displayText}
      </span>
      {/* Blinking Terminal Cursor in Accent Red */}
      <span
        className="ml-1 inline-block h-[1.1em] w-[2.5px] bg-[#ff0000] animate-pulse align-middle shadow-[0_0_8px_rgba(255,0,0,0.9)]"
        aria-hidden="true"
      />
    </span>
  );
}
