"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface VideoSectionProps {
  videoSrc: string;
  title: string | React.ReactNode;
  description: string;
  isReversed?: boolean;
  fallbackImageSrc?: string;
}

function VideoSection({ videoSrc, title, description, isReversed = false, fallbackImageSrc }: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Simple play/pause functionality
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Error playing video:", err));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // On mobile, stack content vertically with video first, then text
  // On desktop, use the isReversed prop to determine order
  const contentOrder = isReversed ? "order-2 md:order-2" : "order-2 md:order-1";
  const videoOrder = isReversed ? "order-1 md:order-1" : "order-1 md:order-2";

  const slideInVariants = {
    hidden: {
      x: 0,
      y: 20,
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10 lg:gap-12 items-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideInVariants}
        className={`space-y-4 px-2 md:px-0 ${contentOrder} md:col-span-2`}
      >
        <h1 className="font-outfit font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center md:text-start">
          {title}
        </h1>
        <p className="font-outfit font-light text-base sm:text-lg md:text-xl text-center md:text-start text-black/80">
          {description}
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={slideInVariants}
        className={`relative rounded-xl border border-black/10 overflow-hidden mx-auto w-full ${videoOrder} md:col-span-3`}
      >
        <div className="relative pb-[62.5%] w-full"> {/* 16:10 aspect ratio container for slightly taller videos */}
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer"
            autoPlay
            muted
            playsInline
            loop
            controls
            poster={fallbackImageSrc}
            onClick={togglePlay}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Play/Pause overlay for better UX */}
          <div 
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-[#E8D5C4]/80 via-[#FFF5EA]/80 to-[#E8D5C4]/80 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            onClick={togglePlay}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4] border border-black/10 flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
              <span className="text-3xl text-black">{isPlaying ? "⏸" : "▶"}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function HeroVideos() {
  return (
    <>
    <div className="w-full max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="flex flex-col items-center gap-4 md:gap-6 text-center mb-10 md:mb-16 pt-8 md:pt-12"
      >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0A66C2]/10 rounded-full mb-2">
            <span className="font-outfit text-sm font-medium text-[#0A66C2]">Invite-Only Access</span>
          </div>
        <h2 className="font-rufina text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight max-w-[90%] sm:max-w-none font-bold">
          Connect With{" "}
          <span className="text-[#0A66C2]">Your ICP</span> <br />
          on Autopilot
        </h2>
        <p className="font-outfit text-xl sm:text-2xl md:text-3xl font-light max-w-[90%] sm:max-w-none text-black/80">
            Join a community of entrepreneurs using AI to scale their network. More features, easier to use, and more affordable than any competitor.
        </p>
      </motion.div>
      
      {/* Main Demo Video - Full Width */}
      <div className="mb-24">
        <div className="border border-black/5 rounded-2xl p-6 md:p-8 bg-white/80 backdrop-blur-sm">
          <VideoSection
            videoSrc="/post_demo.mp4"
            fallbackImageSrc="/img1.jpg"
            title={
              <span>
                Your Command Center{" "}
                <span className="inline-block text-[#0A66C2]">
                  for Growth
                </span>
              </span>
            }
            description="Built with simplicity as our core principle. Manage all your growth activities from one intuitive dashboard that puts your most important metrics front and center."
            isReversed={true}
          />
        </div>
      </div>

      {/* Feature Videos */}
      <div className="space-y-16 md:space-y-24 pb-16 md:pb-24">
        <VideoSection
          videoSrc="/photo_demo.mp4"
          fallbackImageSrc="/img5.jpg"
          title="Connect with Your Ideal Decision Makers"
          description="Import qualified leads from anywhere—LinkedIn Search, Sales Navigator, event lists, or engagement data. Our platform automatically identifies prospects with the highest conversion potential."
          isReversed={false}
        />

        <VideoSection
          videoSrc="/photo_demo.mp4"
          fallbackImageSrc="/img5.jpg"
          title="Build Relationships while You Sleep"
          description="Our intelligent follow-up system keeps building relationships with prospects until they're ready to buy. Perfect for entrepreneurs who need consistent sales pipeline growth without the daily grind."
          isReversed={true}
        />

        {/* CTA Button */}
        <div className="flex justify-center mt-12">
          <Link href="/sign-up">
            <Button
              variant="secondary"
              size="lg"
              className="font-outfit text-xl px-8 py-6 !bg-[#0A66C2] !text-white hover:!bg-[#0A66C2]/90 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] !border-none"
            >
              <span className="flex items-center gap-3">
                Start Growing For Free <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
