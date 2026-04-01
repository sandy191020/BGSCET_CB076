"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const phrases = [
  [
    { text: "Turn Your Soil into ", highlight: false },
    { text: "Liquid Capital", highlight: true },
  ],
  [
    { text: "अपनी मिट्टी को ", highlight: false },
    { text: "तरल पूंजी", highlight: true },
    { text: " में बदलें", highlight: false },
  ],
  [
    { text: "നിങ്ങളുടെ മണ്ണ് ", highlight: false },
    { text: "ദ്രാവക മൂലധനമാക്കി", highlight: true },
    { text: " മാറ്റുക", highlight: false },
  ],
  [
    { text: "ನಿಮ್ಮ ಮಣ್ಣನ್ನು ", highlight: false },
    { text: "ದ್ರವ ಬಂಡವಾಳವಾಗಿ", highlight: true },
    { text: " ಪರಿವರ್ತಿಸಿ", highlight: false },
  ],
  [
    { text: "உங்கள் மண்ணை ", highlight: false },
    { text: "திரவ மூலதனமாக", highlight: true },
    { text: " மாற்றவும்", highlight: false },
  ],
  [
    { text: "మీ మట్టిని ", highlight: false },
    { text: "ద్రవ మూలధనంగా", highlight: true },
    { text: " మార్చండి", highlight: false },
  ],
];

export function TypewriterTitle() {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let phase: "typing" | "pausing" | "deleting" = "typing";
    let phraseIndex = 0;
    let charIndex = 0;
    let timeout: NodeJS.Timeout;

    const updateDOM = () => {
      if (!containerRef.current) return;
      
      const currentPhrase = phrases[phraseIndex];
      let remainingChars = charIndex;
      
      let html = '<span class="inline-block w-full text-center">';
      for (let i = 0; i < currentPhrase.length; i++) {
        if (remainingChars <= 0) break;
        const segment = currentPhrase[i];
        const chars = Array.from(segment.text); // handles unicode
        const renderText = chars.slice(0, remainingChars).join("");
        remainingChars -= chars.length;
        
        if (segment.highlight) {
          html += `<span class="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">${renderText}</span>`;
        } else {
          html += `<span>${renderText}</span>`;
        }
      }
      
      // Cursor block using native CSS pulse
      html += '<span class="inline-block w-[4px] h-[0.9em] bg-emerald-500 ml-2 align-middle translate-y-[-0.05em] animate-pulse"></span></span>';
      
      containerRef.current.innerHTML = html;
    };

    const loop = () => {
      const currentPhrase = phrases[phraseIndex];
      const totalChars = currentPhrase.reduce((acc, seg) => acc + Array.from(seg.text).length, 0);

      if (phase === "typing") {
        if (charIndex < totalChars) {
          charIndex++;
          updateDOM();
          timeout = setTimeout(loop, 70);
        } else {
          phase = "pausing";
          timeout = setTimeout(loop, 3000);
        }
      } else if (phase === "pausing") {
        phase = "deleting";
        timeout = setTimeout(loop, 30);
      } else if (phase === "deleting") {
        if (charIndex > 0) {
          charIndex--;
          updateDOM();
          timeout = setTimeout(loop, 20);
        } else {
          phraseIndex = (phraseIndex + 1) % phrases.length;
          phase = "typing";
          timeout = setTimeout(loop, 500);
        }
      }
    };

    // run once immediately
    updateDOM();
    timeout = setTimeout(loop, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl min-h-[140px] sm:min-h-[180px] flex items-center justify-center -mt-6 sm:-mt-10"
      ref={containerRef}
      style={{ contain: "layout paint" }}
    />
  );
}
