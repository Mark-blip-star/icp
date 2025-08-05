"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Logo data
const logos = [
  {
    id: 1,
    src: "/palantir.png",
    alt: "Palantir",
    width: 160,
    height: 52,
    className: "w-40 md:w-52 lg:w-60"
  },
  {
    id: 2,
    src: "/schwab.png",
    alt: "Charles Schwab",
    width: 240,
    height: 75,
    className: "w-48 md:w-72 lg:w-80"
  },
  {
    id: 3,
    src: "/mckinsey.png",
    alt: "McKinsey",
    width: 220,
    height: 70,
    className: "w-48 md:w-64 lg:w-72"
  },
  {
    id: 4,
    src: "/linkedin.png",
    alt: "LinkedIn",
    width: 100,
    height: 32,
    className: "w-32 md:w-40 lg:w-48"
  },
  {
    id: 5,
    src: "/anduril.png",
    alt: "Anduril",
    width: 200,
    height: 65,
    className: "w-44 md:w-60 lg:w-72"
  },
  {
    id: 6,
    src: "/lululemon.png",
    alt: "Lululemon",
    width: 100,
    height: 32,
    className: "w-28 md:w-32 lg:w-40"
  }
];

export default function SocialProof() {
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // Duplicate logos for continuous scrolling
  const duplicatedLogos = [...logos, ...logos];
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let scrollAmount = 0;
    const scrollSpeed = 0.5; // pixels per frame
    const gap = 48; // gap between logos (gap-12 = 48px)
    
    const getTotalWidth = () => {
      return logos.reduce((acc, logo) => {
        const logoEl = container.querySelector(`[data-logo-id="${logo.id}"]`);
        return acc + (logoEl?.clientWidth || 0) + gap;
      }, 0);
    };
    
    const totalWidth = getTotalWidth();
    
    const scroll = () => {
      if (isPaused) return;
      
      scrollAmount += scrollSpeed;
      
      if (scrollAmount >= totalWidth) {
        container.style.transform = `translateX(0px)`;
        scrollAmount = 0.5;
      }
      
      container.style.transform = `translateX(-${scrollAmount}px)`;
      autoScrollRef.current = requestAnimationFrame(scroll);
    };
    
    autoScrollRef.current = requestAnimationFrame(scroll);
    
    return () => {
      if (autoScrollRef.current !== null) {
        cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, [isPaused]);

  // Commenting out the entire section for now
  /*
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="flex flex-col items-center gap-4 md:gap-6 text-center mb-12 md:mb-16"
      >
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-rufina mb-6 tracking-tight">
          <span className="text-[#B69B7D]">Engineered</span> by{" "}
          Tech Leaders
        </h2>
        <p className="font-outfit font-light text-xl sm:text-2xl md:text-3xl max-w-[90%] sm:max-w-3xl mx-auto text-black/80">
          Created by former senior engineers from world-class tech companies—applying{" "}
          <span className="text-[#B69B7D] font-normal">enterprise AI expertise</span>{" "}
          to supercharge your personal brand
        </p>
      </motion.div>
    </section>
  );
  */

  // Return null for now
  return null;
} 