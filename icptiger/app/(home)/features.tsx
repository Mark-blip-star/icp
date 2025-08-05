"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { WaitlistPopup } from "@/components/ui/waitlist-popup";
import { motion } from "framer-motion";

export default function FeaturesSection() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <>
    {/* New Section: Hunt. Connect. Win. */}
    <section className="relative w-full overflow-hidden py-8 md:py-12 mb-12 md:mb-20 mt-0">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-10 md:mb-14">
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-recoleta font-bold mb-3 tracking-tight"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            Hunt. Connect. <span className="text-[#0A66C2]">Win.</span>
          </motion.h2>
          <motion.p
            className="font-outfit font-light text-xl sm:text-2xl md:text-3xl max-w-[90%] sm:max-w-3xl mx-auto text-black/80 mt-6"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.18 }}
          >
            Users typically add 500+ quality connections each month (~6000/year) while Tiger runs quietly in the background.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h3 className="font-outfit text-2xl md:text-3xl font-bold mb-3 text-gray-900">Effortless</h3>
            <p className="font-outfit text-lg md:text-xl text-gray-600 leading-relaxed font-light">Most people get set up in under 3 minutes even if they’ve never used tools like this before. Try it yourself.</p>
          </motion.div>
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            <h3 className="font-outfit text-2xl md:text-3xl font-bold mb-3 text-gray-900">Safe</h3>
            <p className="font-outfit text-lg md:text-xl text-gray-600 leading-relaxed font-light">Designed to respect LinkedIn’s rules. Tiger scrolls, pauses, and messages like a human, keeping your account safe.</p>
          </motion.div>
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          >
            <h3 className="font-outfit text-2xl md:text-3xl font-bold mb-3 text-gray-900">Always On</h3>
            <p className="font-outfit text-lg md:text-xl text-gray-600 leading-relaxed font-light">Tiger keeps running even when you’re offline. Outreach doesn’t stop just because you closed your laptop.</p>
          </motion.div>
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
          >
            <h3 className="font-outfit text-2xl md:text-3xl font-bold mb-3 text-gray-900">High ROI</h3>
            <p className="font-outfit text-lg md:text-xl text-gray-600 leading-relaxed font-light">Way cheaper than the other guys. And it usually pays for itself with one solid reply.</p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Main Feature Sections - Alternating Layouts */}
    <section className="relative w-full overflow-hidden py-8 md:py-16 mb-16 md:mb-24 mt-8 md:mt-12">
      <div className="max-w-7xl mx-auto px-4 relative flex flex-col gap-24">
        {/* Section 1: Paste your search (text left, video right) */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-recoleta font-bold mb-6 tracking-tight">
              Import <span className="text-[#0A66C2]">Prospects from Anywhere</span>
            </h2>
            <p className="font-outfit font-light text-xl md:text-2xl text-black/80 mb-8">
              Tiger lets you pull leads from LinkedIn search results, CSV files, post likes, post comments, and event attendee lists. Just drop in a URL or upload your list - we'll grab the names and companies automatically.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="bg-[#0A66C2] text-white rounded-xl shadow-md font-outfit text-lg px-8 py-4">
                Try it now <ArrowRight className="inline ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
          <motion.div
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            {/* Import options image */}
            <div className="w-full max-w-2xl aspect-video rounded-3xl shadow-lg overflow-hidden">
              <img 
                src="/import_options.png" 
                alt="Import prospects from anywhere" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Section 2: Write a message (video left, text right) */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-recoleta font-bold mb-6 tracking-tight">
              Write Once, <span className="text-[#0A66C2]">Personalize at Scale</span>
            </h2>
            <p className="font-outfit font-light text-xl md:text-2xl text-black/80 mb-8">
              Instead of tweaking the same message over and over, just write it once. Tiger automatically fills in names and companies and sends each DM like it's handcrafted. When someone replies, it hands the conversation back to you to continue naturally.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="bg-[#0A66C2] text-white rounded-xl shadow-md font-outfit text-lg px-8 py-4">
                See how it works <ArrowRight className="inline ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
          <motion.div
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            {/* Message image */}
            <div className="w-full max-w-2xl aspect-video rounded-3xl shadow-lg overflow-hidden">
              <img 
                src="/message.png" 
                alt="Write a personalized message" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>

      <WaitlistPopup 
        isOpen={isWaitlistOpen} 
        onClose={() => setIsWaitlistOpen(false)} 
      />
    </>
  );
}
