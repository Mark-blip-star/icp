// This component was used before in the landing page, but currently we decided to 
// Remove it because our customers speaks for the product themselves.

"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";


export default function Comparison() {
  const features = [
    { name: "Monthly Cost", values: ["$39", "$49", "$55"] },
    { name: "Viral Posts", values: [true, false, false] },
    { name: "Human Touch", values: [true, false, false] },
    { name: "Your Voice", values: [true, false, false] },
    { name: "No Risk of Account Ban", values: [true, false, false] },
    { name: "LinkedIn Specific", values: [true, false, false] },
    { name: "Original Takes", values: [true, true, false] },
    { name: "1-Click Posts", values: [true, true, true] },
    { name: "Smart Timing", values: [true, true, true] },
  ];

  const competitors = ["ICP Tiger", "Jasper", "Taplio"];

  return (
    <section className="max-w-7xl w-full mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.6, type: "keyframes" }}
        className="flex flex-col items-center gap-6 sm:gap-9 mb-12 sm:mb-16"
      >
        <h1 className="font-riffic-free text-3xl sm:text-4xl md:text-5xl font-black text-center">
          LinkedIn{" "}
          <span className="inline-block px-4 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:scale-105 transition-transform duration-200 rounded-xl">
            Automation
          </span>{" "}
          Compared
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light">Do more, for less.</p>
      </motion.div>

      {/* Mobile View */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, type: "keyframes", delay: 0.2 }}
        className="glass-card md:hidden px-4 py-6"
      >
        {competitors.map((competitor, idx) => (
          <div key={idx} className="mb-8 last:mb-0">
            <div className="text-center mb-4">
              <span
                className={cn(
                  "px-4 py-2 rounded-lg font-outfit transition-colors",
                  competitor === "ICP Tiger" ? "border-2 border-black text-black font-bold" : "font-medium"
                )}
              >
                {competitor}
              </span>
            </div>
            <div className="space-y-4">
              {features.map((feature, featureIdx) => (
                <div key={featureIdx} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{feature.name}</span>
                  {feature.name === "Monthly Cost" ? (
                    <span
                      className={`text-lg ${feature.values[idx] == "$39" ? "font-bold" : "font-medium"}`}
                    >
                      {feature.values[idx]}
                    </span>
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        feature.values[idx] ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {feature.values[idx] ? (
                        <span className="text-green-600 text-lg">✓</span>
                      ) : (
                        <span className="text-red-600 text-2xl -mt-1">&#xd7;</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Desktop View */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, type: "keyframes", delay: 0.2 }}
        className="glass-card hidden md:block px-7 py-10 mb-16 md:mb-24"
      >
        <div className="border-2 border-black rounded-full p-4 mb-8">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="font-bold text-xl col-span-6">Feature</div>
            <div className="text-center col-span-2">
              <span className="px-3 py-1 border-2 border-black rounded-lg text-black text-xl font-bold">
                ICP Tiger
              </span>
            </div>
            <div className="text-center font-medium col-span-2 text-xl">Jasper</div>
            <div className="text-center font-medium col-span-2 text-xl">Taplio</div>
          </div>
        </div>

        <div className="flex flex-col gap-6 ps-4">
          {features.map((feature, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-center">
              <div className="font-medium col-span-6 text-xl">{feature.name}</div>
              {feature.name === "Monthly Cost"
                ? feature.values.map((value, i) => (
                    <div
                      key={i}
                      className={`text-center col-span-2 -ms-4 text-2xl ${value == "$39" ? "font-bold" : "font-medium"}`}
                    >
                      {value}
                    </div>
                  ))
                : feature.values.map((value, i) => (
                    <div key={i} className="flex justify-center col-span-2 -ms-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          value ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {value ? (
                          <span className="text-green-600 text-2xl">✓</span>
                        ) : (
                          <span className="text-red-600 text-4xl -mt-1">&#xd7;</span>
                        )}
                      </div>
                    </div>
                  ))}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
