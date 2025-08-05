

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

export default function FAQ() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-recoleta font-bold mb-6 tracking-tight">
            Tiger <span className="text-[#0A66C2]">101</span>
          </h2>
          <p className="font-outfit font-light text-xl sm:text-2xl md:text-3xl max-w-[90%] sm:max-w-3xl mx-auto text-black/80 mt-8">
            A clear breakdown of Tiger's LinkedIn automation system.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <motion.div
              key={`item-${item}`}
              initial={{ opacity: 0, x: -20, y: 0 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 1,
                type: "keyframes",
                delay: (item - 1) * 0.2,
              }}
            >
              <Accordion type="single" collapsible>
                <AccordionItem
                  value={`item-${item}`}
                  className="bg-white border border-black/10 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <AccordionTrigger className="text-xl font-outfit font-medium text-start text-gray-900 hover:text-[#0A66C2] transition-colors [&>svg]:text-[#0A66C2] [&>svg]:transition-transform [&>svg]:duration-200">
                    {item === 1 && (
                      <span>Is Tiger safe to use with my LinkedIn account?</span>
                    )}
                    {item === 2 && (
                      <span>How does the LinkedIn automation work?</span>
                    )}
                    {item === 3 && (
                      <span>What makes Tiger different from other LinkedIn automation tools?</span>
                    )}
                    {item === 4 && (
                      <span>What specific automation actions can Tiger perform?</span>
                    )}
                    {item === 5 && (
                      <span>Can I customize the automated message sequences?</span>
                    )}
                    {item === 6 && (
                      <span>How does Tiger handle responses?</span>
                    )}
                    {item === 7 && (
                      <span>Can I import my own lead lists?</span>
                    )}
                    {item === 8 && (
                      <span>What analytics and reporting features are available?</span>
                    )}
                    {item === 9 && (
                      <span>How does Tiger prevent duplicate outreach?</span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="text-lg leading-relaxed text-black/80 pt-4 font-outfit">
                    {item === 1 && (
                      <span>
                        Yes. Safety is one of the main reasons people choose Tiger. We never ask for your LinkedIn login or store your credentials. Unlike browser extensions or risky hacks, Tiger runs entirely in the cloud and behaves like a real person. It follows LinkedIn’s limits and activity patterns to keep your account protected while your outreach runs in the background.
                      </span>
                    )}
                    {item === 2 && (
                      <span>
                        Tiger runs in the cloud and works quietly in the background, just like you would. You paste in a LinkedIn search URL, and Tiger starts viewing profiles, sending connection requests, and following up with personalized messages at safe, human-like speeds.
                      </span>
                    )}
                    {item === 3 && (
                      <span>
                        Most tools rely on clunky browser extensions, store your login, or use aggressive tactics that get flagged. Tiger is different. It runs securely in the cloud, mimics real user behavior, and doesn’t require any plugins or risky setups. It's simple, safe automation that works while you focus on what matters.
                      </span>
                    )}
                    {item === 4 && (
                      <span>
                        Tiger can send connection requests and follow-up messages. Just plug in a LinkedIn search URL, write your message, and Tiger handles the rest safely and automatically.
                      </span>
                    )}
                    {item === 5 && (
                      <span>
                        Yes. You control your connection message, follow-ups, and timing. Tiger pauses the automation as soon as someone replies, so you're always in control of the conversation.
                      </span>
                    )}
                    {item === 6 && (
                      <span>
                        When someone replies, Tiger stops outreach to that person. You get the full conversation history and can take over directly. No awkward double-messages or missed replies.
                      </span>
                    )}
                    {item === 7 && (
                      <span>
                        Yes. You can import LinkedIn search URLs, CSV files with LinkedIn profile URLs, people who liked a LinkedIn post, people who commented on a LinkedIn post, and LinkedIn event attendees. Sales Navigator integration is coming soon. Use filters to target the right people and skip the rest.
                      </span>
                    )}
                    {item === 8 && (
                      <span>
                        Tiger gives you a clean dashboard with everything you need like acceptance rates, replies, and campaign stats. You can see what's working and improve your outreach over time.
                      </span>
                    )}
                    {item === 9 && (
                      <span>
                        Tiger tracks your outreach history and skips anyone you've already contacted. It also includes a smart cooldown window before re-engaging someone, so your messages stay professional.
                      </span>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
