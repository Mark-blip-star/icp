"use client";
import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";

export default function DemoVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setShowOverlay(false);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowOverlay(true);
  };

  return (
    <section id="demo" className="w-full py-16 md:py-20 bg-white" style={{ scrollMarginTop: '2rem' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="font-recoleta text-4xl md:text-5xl lg:text-6xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            Watch <span className="text-[#0A66C2]">Tiger</span> Work
          </motion.h2>
          <motion.p
            className="font-outfit font-light text-xl sm:text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, ease: "easeInOut", delay: 0.18 }}
          >
            In under 2 minutes, watch Tiger run campaigns that hires top prospects.
          </motion.p>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Video Container with enhanced styling */}
          <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              controls
              poster="/thumbnail.png"
              onEnded={handleVideoEnd}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              preload="metadata"
            >
              <source src="https://icptigerdemo.s3.amazonaws.com/icptigerdemo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Enhanced Play Button Overlay */}
            {showOverlay && (
              <div 
                className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 backdrop-blur-sm"
                onClick={handlePlayPause}
              >
                <div className="group">
                  <div className="w-24 h-24 bg-white/95 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300 border-4 border-white/20">
                    <Play className="w-8 h-8 text-[#0A66C2] ml-1" fill="#0A66C2" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto mt-16">
        <motion.h3
          className="text-lg md:text-xl font-outfit font-light text-gray-500 mb-12 mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          Feedback we've gotten from invited users so far…
        </motion.h3>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            visible: { transition: { staggerChildren: 0.18 } },
          }}
        >
          {/* Testimonial 1 */}
          <motion.div
            className="glass-card flex flex-col items-center text-center relative"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <img src="/testimonial1.png" alt="Invited user feedback screenshot" className="w-full max-h-[220px] rounded-xl object-contain mb-1" />
            <span className="text-xs text-gray-500 mt-1">Technical Sourcer · Hoboken, NJ</span>
          </motion.div>
          {/* Testimonial 2 */}
          <motion.div
            className="glass-card flex flex-col items-center text-center relative"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <img src="/testimonial2.png" alt="Invited user feedback screenshot" className="w-full max-h-[220px] rounded-xl object-contain mb-1" />
            <span className="text-xs text-gray-500 mt-1">Healthcare Recruiter · Austin, TX</span>
          </motion.div>
          {/* Testimonial 3 */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 flex flex-col items-center text-center relative"
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <img src="/testimonial3.png" alt="Invited user feedback screenshot" className="w-full max-h-[220px] rounded-xl object-contain mb-1" />
            <span className="text-xs text-gray-500 mt-1">Startup Recruiter, Remote</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 