
"use client";
import { Shield, Zap, UserPlus, Lock, Clock, Bot, CheckCircle2, ArrowRight, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useFeatureFlags } from "@/lib/feature-flags";
import { useState } from "react";
import { WaitlistPopup } from "@/components/ui/waitlist-popup";
import { motion } from "framer-motion";


export default function SafetySection() {
  const featureFlags = useFeatureFlags();
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <>
    <div className="flex flex-col items-center px-4 md:px-6 lg:px-8 pt-2 md:pt-4 pb-0 mb-8 md:mb-12">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-20">
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-recoleta font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            Stays Safe <span className="text-[#0A66C2]">by Default</span>
          </motion.h2>
          <motion.p
            className="font-outfit font-light text-xl sm:text-2xl md:text-3xl max-w-[90%] sm:max-w-3xl mx-auto text-black/80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, ease: "easeInOut", delay: 0.18 }}
          >
            Tiger's built from the ground up to behave like you would and protect your account.
          </motion.p>
        </div>

        <div className="relative z-10">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              visible: { transition: { staggerChildren: 0.18 } },
            }}
          >
            {/* Smart Rate Limiting */}
            <motion.div
              className="glass-card group p-10"
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <Clock className="h-10 w-10 text-[#0A66C2] mb-6" />
              <h3 className="text-2xl md:text-3xl font-outfit font-bold mb-4 text-gray-900 leading-tight">Intelligent Timing</h3>
              <p className="text-lg font-outfit text-gray-600 leading-relaxed mb-6 font-light">
                Sends 8-12 messages per hour, not 100+ like bots
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-gray-900 font-outfit">
                  <CheckCircle2 className="h-5 w-5 text-[#0A66C2] mt-0.5 flex-shrink-0" />
                  <span className="text-base leading-relaxed">Stops at LinkedIn's weekly connection limit automatically</span>
                </div>
                <div className="flex items-start gap-4 text-gray-900 font-outfit">
                  <CheckCircle2 className="h-5 w-5 text-[#0A66C2] mt-0.5 flex-shrink-0" />
                  <span className="text-base leading-relaxed">Spreads daily activity across 6-8 hour windows with random breaks</span>
                </div>
              </div>
            </motion.div>

            {/* Human Pattern Simulation */}
            <motion.div
              className="glass-card group p-10"
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <Users className="h-10 w-10 text-[#0A66C2] mb-6" />
              <h3 className="text-2xl md:text-3xl font-outfit font-bold mb-4 text-gray-900 leading-tight">Human Behavior Patterns</h3>
              <p className="text-lg font-outfit text-gray-600 leading-relaxed mb-6 font-light">
                Randomized 2-8 second delays between clicks and scrolls
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-gray-900 font-outfit">
                  <CheckCircle2 className="h-5 w-5 text-[#0A66C2] mt-0.5 flex-shrink-0" />
                  <span className="text-base leading-relaxed">Varies typing speed with natural 150-300ms keystroke patterns</span>
                </div>
                <div className="flex items-start gap-4 text-gray-900 font-outfit">
                  <CheckCircle2 className="h-5 w-5 text-[#0A66C2] mt-0.5 flex-shrink-0" />
                  <span className="text-base leading-relaxed">Takes 30-90 second "reading breaks" between profiles like real users</span>
                </div>
              </div>
            </motion.div>

            {/* IP Rotation */}
            <motion.div
              className="glass-card group p-10"
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <Globe className="h-10 w-10 text-[#0A66C2] mb-6" />
              <h3 className="text-2xl md:text-3xl font-outfit font-bold mb-4 text-gray-900 leading-tight">Residential IP Network</h3>
              <p className="text-lg font-outfit text-gray-600 leading-relaxed mb-6 font-light">
                Routes through real home internet connections from major ISPs
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-gray-900 font-outfit">
                  <CheckCircle2 className="h-5 w-5 text-[#0A66C2] mt-0.5 flex-shrink-0" />
                  <span className="text-base leading-relaxed">Uses same IP infrastructure as LinkedIn's legitimate users</span>
                </div>
                <div className="flex items-start gap-4 text-gray-900 font-outfit">
                  <CheckCircle2 className="h-5 w-5 text-[#0A66C2] mt-0.5 flex-shrink-0" />
                  <span className="text-base leading-relaxed">Avoids AWS, Google Cloud, and datacenter IPs that LinkedIn flags instantly</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>

      <WaitlistPopup 
        isOpen={isWaitlistOpen} 
        onClose={() => setIsWaitlistOpen(false)} 
      />
    </>
  );
} 
