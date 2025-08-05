"use client";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimatePresence, motion as fmMotion } from "framer-motion";

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ["Entrepreneurs", "Salespeople", "Creators", "Recruiters"];

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-12 flex flex-col items-center text-center gap-12">
        {/* Headline */}
        <motion.h1
          className="font-recoleta text-4xl sm:text-5xl md:text-6xl font-black leading-[1.7] mb-2 w-full max-w-none mx-auto text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <span className="block mb-2">The <span className="text-[#0A66C2]">Lean, Safe</span> Way</span>
          <span className="block mb-2">to <span className="text-[#0A66C2]">Automate</span> <span className="text-[#0A66C2]">LinkedIn</span> for</span>
          <span className="block w-full" style={{ minHeight: '1.2em' }}>
            <span className="inline-flex items-baseline justify-center align-baseline" style={{ width: '13ch', verticalAlign: 'baseline' }}>
              <AnimatePresence mode="wait" initial={false}>
                <fmMotion.span
                  key={roles[roleIndex]}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="text-[#0A66C2] w-full text-center block mt-2"
                  style={{ verticalAlign: 'baseline' }}
                >
                  {roles[roleIndex]}
                </fmMotion.span>
              </AnimatePresence>
            </span>
          </span>
        </motion.h1>
        {/* Subheadline */}
        <motion.p
          className="font-outfit text-lg sm:text-2xl text-gray-700 mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut", delay: 0.18 }}
        >
          Reach hundreds of prospects every week on autopilot.{"\n"}More customers. More hires. More capital.
        </motion.p>
        {/* CTA Row */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 mb-6 w-full justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut", delay: 0.32 }}
        >
          <Link href="/sign-up">
            <Button
              variant="secondary"
              size="lg"
              className="font-outfit text-xl sm:text-2xl px-8 py-6 !bg-[#0A66C2] !text-white hover:!bg-[#0A66C2]/90 border-2 border-[#0A66C2] rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.05] font-bold"
            >
              <span className="flex items-center gap-3">
                Try It Free For 7 Days <ArrowRight className="w-7 h-7" />
              </span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
