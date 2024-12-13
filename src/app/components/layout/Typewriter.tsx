import React, { useEffect, useState } from "react";

const Typewriter: React.FC = () => {
  const words = [
    "Hello!",
    "What can I help with?",
    "Precision AI for Professionals",
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDelayed, setIsDelayed] = useState(true); // To manage the initial delay

  useEffect(() => {
    // Add a delay of 1-2 seconds before starting the typewriter
    const delayTimer = setTimeout(() => setIsDelayed(false), 1500);
    return () => clearTimeout(delayTimer);
  }, []);

  useEffect(() => {
    if (isDelayed) return;

    const currentWord = words[currentWordIndex];

    const type = () => {
      if (isDeleting) {
        setDisplayText((prev) => prev.slice(0, -1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        setDisplayText((prev) => currentWord.slice(0, prev.length + 1));
        if (displayText.length === currentWord.length) {
          setIsDeleting(true);
        }
      }
    };

    const timer = setTimeout(type, 100);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentWordIndex, isDelayed]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1 id="typewriter" className="text-4xl font-bold max-md:text-xl">
        {displayText}
      </h1>
    </div>
  );
};

export default Typewriter;
