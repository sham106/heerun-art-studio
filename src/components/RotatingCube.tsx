import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import weddingHero from "@/assets/wedding-hero.jpg";
import corporateHero from "@/assets/corporate-hero.jpg";
import portraitHero from "@/assets/portrait-hero.jpg";
import eventHero from "@/assets/event-hero.jpg";

const services = [
  {
    id: 0,
    title: "Wedding Photography",
    tagline: "Capturing your perfect day",
    image: weddingHero,
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: 1,
    title: "Corporate Events",
    tagline: "Professional business coverage",
    image: corporateHero,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    title: "Portrait Sessions",
    tagline: "Stunning personal portraits",
    image: portraitHero,
    gradient: "from-purple-500 to-violet-600",
  },
  {
    id: 3,
    title: "Event Coverage",
    tagline: "Dynamic moments captured",
    image: eventHero,
    gradient: "from-amber-500 to-orange-600",
  },
];

const RotatingCube = () => {
  const [currentFace, setCurrentFace] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFace((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentService = services[currentFace];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] perspective-1000">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFace}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="relative w-full h-full">
            {/* Image Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentService.image})` }}
            />
            
            {/* Gradient Overlay - Reduced opacity for clearer images */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentService.gradient} opacity-30`} />
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center text-white">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                {currentService.title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl font-light"
              >
                {currentService.tagline}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {services.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentFace(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === currentFace ? "bg-primary w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default RotatingCube;