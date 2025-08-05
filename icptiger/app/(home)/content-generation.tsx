"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Zap } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";

export default function ContentGeneration() {
  // Commenting out the entire section for now
  /*
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="flex flex-col items-center gap-3 md:gap-4 text-center mb-8 md:mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black mb-4 bg-gradient-to-r from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4]">
          <Sparkles className="h-5 w-5" />
          <span className="font-outfit font-medium">Included in All Plans</span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-rufina mb-8 tracking-tight">
          Create{" "}
          <span className="text-[#B69B7D]">High-Converting</span>{" "}
          Content in Seconds
        </h2>
        <p className="font-outfit text-xl sm:text-2xl md:text-3xl font-light max-w-[90%] sm:max-w-2xl mx-auto">
          Generate engagement-optimized posts and attention-grabbing visuals that drive measurable business results
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-10 mt-8 mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="bg-white border-2 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-[2px] hover:-translate-x-[2px] transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-r from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4] border-2 border-black">
              <Zap className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="text-2xl font-outfit font-semibold">AI Content Engine</h3>
              <p className="font-outfit text-gray-600">Create revenue-generating LinkedIn posts</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#E8D5C4] to-[#FFF5EA] border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Check className="w-3 h-3 text-black" />
              </div>
              <div>
                <h4 className="font-outfit font-semibold mb-1">Industry-Specific Content</h4>
                <p className="font-outfit text-gray-600">Generate posts tailored to your exact niche and audience</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#E8D5C4] to-[#FFF5EA] border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Check className="w-3 h-3 text-black" />
              </div>
              <div>
                <h4 className="font-outfit font-semibold mb-1">Proven Engagement Templates</h4>
                <p className="font-outfit text-gray-600">Use formats tested on millions of high-performing posts</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#E8D5C4] to-[#FFF5EA] border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Check className="w-3 h-3 text-black" />
              </div>
              <div>
                <h4 className="font-outfit font-semibold mb-1">Voice Matching Technology</h4>
                <p className="font-outfit text-gray-600">Content that sounds authentically like you, not generic AI</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="bg-white border-2 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-[2px] hover:-translate-x-[2px] transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-r from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4] border-2 border-black">
              <Sparkles className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="text-2xl font-outfit font-semibold">Visual Content Studio</h3>
              <p className="font-outfit text-gray-600">Create scroll-stopping professional visuals</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#E8D5C4] to-[#FFF5EA] border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Check className="w-3 h-3 text-black" />
              </div>
              <div>
                <h4 className="font-outfit font-semibold mb-1">Brand-Aligned Visuals</h4>
                <p className="font-outfit text-gray-600">Generate images perfectly matching your brand identity</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#E8D5C4] to-[#FFF5EA] border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Check className="w-3 h-3 text-black" />
              </div>
              <div>
                <h4 className="font-outfit font-semibold mb-1">Multi-Style Generator</h4>
                <p className="font-outfit text-gray-600">Choose from 25+ professional styles optimized for B2B</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#E8D5C4] to-[#FFF5EA] border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Check className="w-3 h-3 text-black" />
              </div>
              <div>
                <h4 className="font-outfit font-semibold mb-1">One-Click Generation</h4>
                <p className="font-outfit text-gray-600">Create perfect LinkedIn visuals in under 10 seconds</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
        className="flex justify-center"
      >
        <Button 
          size="lg" 
          className="group bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] font-outfit px-6 py-3 border-none"
        >
          Create High-Performing Content
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </section>
  );
  */

  // Return null for now
  return null;
} 