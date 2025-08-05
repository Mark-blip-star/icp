"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight, Sparkles, Brain, PenLine, ImageIcon, Bot, Users, Zap, Shield, Clock } from "lucide-react";
import Header from "@/app/(home)/header";
import Footer from "@/app/(home)/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFeatureFlags } from "@/lib/feature-flags";
import { WaitlistPopup } from "@/components/ui/waitlist-popup";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const prices = {
  monthly: 39,
  annual: 29,
} as const;

const savings: Record<string, number> = {
  monthly: 0,
  annual: Math.round((1 - 29/39) * 100)
};

const features = [
  "Unlimited Contacts",
  "Unlimited Campaigns & Messages", 
  "Import LinkedIn Search URLs",
  "Secure by Design",
  "Advanced Targeting",
  "Built-In LinkedIn Protection",
  "Real-Time Analytics",
  "Duplicate Detection",
  "Priority Support"
];

const benefits = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "10x Faster Growth",
    description: "Automate your LinkedIn outreach and grow your network exponentially"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Safe & Compliant",
    description: "Built-in safety features to protect your LinkedIn account"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Save 20+ Hours/Week",
    description: "Automate repetitive tasks and focus on what matters"
  }
];

const yearlyPaymentLink =
  process.env.NODE_ENV == "development"
    ? "https://buy.stripe.com/test_14k00l8TT0uUfMk289"
    : "https://buy.stripe.com/14kdUr9uX6Afgtq5kk";
const monthlyPaymentLink =
  process.env.NODE_ENV == "development"
    ? "https://buy.stripe.com/test_bIY8wRgml7Xm57G6oo"
    : "https://buy.stripe.com/fZeeYvePh2jZcda9AB";

type PricingPeriod = 'monthly' | 'annual';

const getPaymentLink = (period: PricingPeriod, userEmail: string | null) => {
  const baseUrl = period === 'annual' ? yearlyPaymentLink : monthlyPaymentLink;
  return userEmail ? `${baseUrl}?prefilled_email=${encodeURIComponent(userEmail)}` : baseUrl;
};

export default function PricingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PricingPeriod>('monthly');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const { showTrustedBySection } = useFeatureFlags();
  const router = useRouter();

  return (
    <div className="overflow-x-hidden flex flex-col min-h-screen">
      <main className="flex flex-col w-full p-4 pb-0 md:p-0 flex-grow">
        <Header />
        <div className="pt-4 md:pt-8 pb-16 md:pb-24">
          {/* Hero Section */}
          <section className="relative w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 pt-1 pb-8 md:pt-2 md:pb-12 relative">
              <div className="flex flex-col items-center text-center gap-4 md:gap-12">
                <motion.h1 
                  className="font-recoleta text-4xl sm:text-5xl md:text-6xl font-black max-w-4xl w-full text-center leading-tight mx-auto"
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  LinkedIn Outreach <span className="text-[#0A66C2]">That Just Works</span>
                </motion.h1>
                <motion.p 
                  className="font-outfit font-light text-lg sm:text-2xl text-gray-700 text-center max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.18 }}
                >
                  One good lead makes Tiger free. Costs less than daily coffee.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.32 }}
                >
                  <Button 
                    variant="secondary"
                    size="lg" 
                    className="!bg-[#0A66C2] hover:!bg-[#0A66C2]/90 !text-white !border-none rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] font-outfit text-lg sm:text-xl lg:text-2xl px-6 sm:px-8 py-4 sm:py-6 mt-4 md:mt-0"
                    onClick={() => router.push("/sign-up")}
                  >
                    <span className="flex items-center gap-2 sm:gap-3 text-white">
                      Try It Free — No Risk, No Credit Card
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Trust Building Section */}
          {showTrustedBySection && (
            <section className="relative w-full overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
                <motion.div 
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-recoleta mb-6 tracking-tight">
                    Not Everything Needs to be a Platform
                  </h2>
                  <p className="font-outfit text-lg md:text-xl text-black/80 max-w-2xl mx-auto">
                    Most tools try to do everything. Tiger masters one thing: safe, effective LinkedIn outreach.
                  </p>
                </motion.div>

                {/* Testimonial */}
                <motion.div 
                  className="max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.18 }}
                >
                  <div className="glass-card p-8 md:p-12">
                    <div className="text-center">
                      <p className="font-outfit text-xl md:text-2xl text-black/80 mb-8">
                        "Ciela has completely transformed how I approach LinkedIn. The AI-powered features save me hours each week, and the results have been incredible. Best investment I've made for my business growth."
                      </p>
                      <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#0A66C2]/5 border border-[#0A66C2]/20 flex items-center justify-center">
                          <span className="font-outfit font-bold text-[#0A66C2]">MK</span>
                        </div>
                        <div className="text-left">
                          <div className="font-outfit font-semibold">Michael Klein</div>
                          <div className="font-outfit text-sm text-black/60">Entrepreneur & CEO at TechFlow</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Trust Signals */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={{
                    visible: { transition: { staggerChildren: 0.18 } },
                  }}
                >
                  <motion.div 
                    className="glass-card"
                    variants={{
                      hidden: { opacity: 0, y: 32 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4] border-2 border-black flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3 className="font-outfit text-xl font-semibold">Free Tier Available</h3>
                    </div>
                    <p className="font-outfit text-black/80">
                      Get started with 500 free contacts per month. Upgrade anytime to unlock unlimited imports and campaigns.
                    </p>
                  </motion.div>

                  <motion.div 
                    className="glass-card"
                    variants={{
                      hidden: { opacity: 0, y: 32 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0A66C2]/5 border border-[#0A66C2]/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#0A66C2]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 15C15.866 15 19 11.866 19 8C19 4.134 15.866 1 12 1C8.13401 1 5 4.134 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3 className="font-outfit text-xl font-semibold">Best-in-Class Support</h3>
                    </div>
                    <p className="font-outfit text-black/80">
                      Get priority support from our expert team. We're here to help you succeed with personalized guidance.
                    </p>
                  </motion.div>

                  <motion.div 
                    className="glass-card"
                    variants={{
                      hidden: { opacity: 0, y: 32 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0A66C2]/5 border border-[#0A66C2]/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#0A66C2]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11.994 16H12.004" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3 className="font-outfit text-xl font-semibold">Cancel Anytime</h3>
                    </div>
                    <p className="font-outfit text-black/80">
                      No long-term contracts or commitments. You're free to cancel your subscription at any time.
                    </p>
                  </motion.div>
                </motion.div>

                {/* Final CTA */}
                <motion.div 
                  className="mt-16 text-center"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.32 }}
                >
                  <Button 
                    size="lg" 
                    variant="secondary"
                    suppressHydrationWarning
                    className="!bg-[#0A66C2] hover:!bg-[#0A66C2]/90 !text-white !border-none rounded-xl shadow-sm hover:shadow-md transition-all duration-300 font-outfit text-lg px-10 py-6"
                    onClick={() => router.push("/sign-up")}
                  >
                    <span className="flex items-center gap-3 text-white">
                      Join ICP Tiger
                      <ArrowRight className="h-6 w-6 text-white" />
                    </span>
                  </Button>
                </motion.div>
              </div>
            </section>
          )}

          {/* Competitive Comparison Section */}
          <section className="relative w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <h2 className="font-recoleta text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl mx-auto tracking-tight">
                  Not Everything Needs to be a <span className="text-[#0A66C2]">Platform</span>
                </h2>
                <p className="font-outfit font-light text-xl sm:text-2xl max-w-[90%] sm:max-w-2xl mx-auto mt-8 text-black/80">
                  Most tools try to do everything. Tiger masters one thing: safe, effective LinkedIn outreach.
                </p>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={{
                  visible: { transition: { staggerChildren: 0.18 } },
                }}
              >
                {/* Competitors */}
                <motion.div 
                  className="glass-card bg-gray-100/70 border border-gray-300 text-gray-500"
                  variants={{
                    hidden: { opacity: 0, x: -32, y: 32 },
                    visible: { opacity: 1, x: 0, y: 0 },
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <h3 className="font-recoleta text-2xl font-bold mb-8 text-gray-500">Other solutions</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-300">
                      <div>
                        <div className="font-outfit text-lg font-medium text-gray-500">Waalaxy</div>
                        <div className="font-outfit text-sm text-gray-400 mt-1">Chrome extension</div>
                      </div>
                      <div className="text-right">
                        <div className="font-outfit text-lg font-medium text-gray-400">$43-131/mo</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-gray-300">
                      <div>
                        <div className="font-outfit text-lg font-medium text-gray-500">Dripify</div>
                        <div className="font-outfit text-sm text-gray-400 mt-1">Limited basic tier</div>
                      </div>
                      <div className="text-right">
                        <div className="font-outfit text-lg font-medium text-gray-400">$59-99/mo</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-outfit text-lg font-medium text-gray-500">Expandi</div>
                        <div className="font-outfit text-sm text-gray-400 mt-1">Extra cost for basic features</div>
                      </div>
                      <div className="text-right">
                        <div className="font-outfit text-lg font-medium text-gray-400">$99/mo</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                      <div>
                        <div className="font-outfit text-lg font-medium text-gray-500">Zopto</div>
                        <div className="font-outfit text-sm text-gray-400 mt-1">Cloud-based, higher cost</div>
                      </div>
                      <div className="text-right">
                        <div className="font-outfit text-lg font-medium text-gray-400">$215/mo</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Our Solution */}
                <motion.div 
                  className="relative"
                  variants={{
                    hidden: { opacity: 0, x: 32, y: 32 },
                    visible: { opacity: 1, x: 0, y: 0 },
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <div className="absolute -top-3 -right-3 z-20">
                    <motion.div
                      animate={{ rotate: [0, -8, 8, -6, 6, -3, 3, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                      className="bg-gradient-to-r from-[#0A66C2] to-[#0A66C2]/80 text-white px-6 py-2 rounded-full font-outfit text-sm font-semibold shadow-lg"
                    >
                      Best Value
                    </motion.div>
                  </div>
                  <div className="glass-card h-full transition-all duration-300">
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <h3 className="font-recoleta text-3xl font-bold text-[#0A66C2]">Tiger</h3>
                          <p className="font-outfit text-lg text-gray-600 mt-1">Your LinkedIn copilot</p>
                        </div>
                        <div className="text-right">
                          <div className="font-recoleta text-4xl font-bold text-[#0A66C2]">$39</div>
                          <div className="font-outfit text-lg text-gray-600">per month</div>
                        </div>
                      </div>
                      <ul className="space-y-5 mb-8">
                        <li className="flex items-start gap-4">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <span className="font-outfit text-lg font-semibold text-gray-900">Cloud-based (works 24/7)</span>
                            <p className="font-outfit text-sm text-gray-600 mt-1">No computer needed, runs automatically</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-4">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <span className="font-outfit text-lg font-semibold text-gray-900">Unlimited campaigns & connections</span>
                            <p className="font-outfit text-sm text-gray-600 mt-1">Scale without restrictions</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-4">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <span className="font-outfit text-lg font-semibold text-gray-900">Simple, intuitive interface</span>
                            <p className="font-outfit text-sm text-gray-600 mt-1">Get started in minutes, not hours</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-4">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <span className="font-outfit text-lg font-semibold text-gray-900">
                              AI-powered targeting included <span className="text-xs text-gray-400 font-normal">(in beta)</span>
                            </span>
                            <p className="font-outfit text-sm text-gray-600 mt-1">Find your ideal prospects automatically</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4">
              {/* Pricing Header */}
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-recoleta font-bold mb-6 tracking-tight">
                  Outreach That <span className="text-[#0A66C2]">Prints Meetings</span>
                </h2>
                <p className="font-outfit font-light text-xl sm:text-2xl max-w-[90%] sm:max-w-3xl mx-auto text-black/80">
                  No credit card required to try.
                </p>
              </motion.div>

              <div className="relative flex justify-center w-full max-w-[16rem] p-0.5 mx-auto mb-8 bg-gray-200 rounded-full">
                <button
                  onClick={() => setSelectedPeriod('monthly')}
                  className={`w-1/2 py-2 text-sm font-semibold transition-colors relative ${selectedPeriod === 'monthly' ? 'text-blue-600' : 'text-gray-600'}`}
                >
                  <span className="relative z-10">Monthly</span>
                  {selectedPeriod === 'monthly' && (
                    <motion.div
                      layoutId="active-period"
                      className="absolute inset-0 bg-white rounded-full shadow"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setSelectedPeriod('annual')}
                  className={`w-1/2 py-2 text-sm font-semibold transition-colors relative ${selectedPeriod === 'annual' ? 'text-blue-600' : 'text-gray-600'}`}
                >
                  <span className="relative z-10">Annually</span>
                  {selectedPeriod === 'annual' && (
                    <motion.div
                      layoutId="active-period"
                      className="absolute inset-0 bg-white rounded-full shadow"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              </div>

              <motion.div 
                className="flex justify-center max-w-4xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={{
                  visible: { transition: { staggerChildren: 0.18 } },
                }}
              >
                {/* Pro Tier */}
                <motion.div 
                  className="glass-card p-6 md:p-8 shadow-lg relative flex flex-col w-full max-w-lg"
                  variants={{
                    hidden: { opacity: 0, y: 32 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  {selectedPeriod === 'annual' && (
                    <Badge className="absolute top-0 right-0 -mt-3 -mr-3 transform-gpu bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 border-transparent">
                      Save {savings.annual}%
                    </Badge>
                  )}
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-recoleta font-bold mb-6 text-left text-black mt-4">Professional</h3>
                    <div className="flex items-baseline gap-3 mb-8">
                      <div className="text-4xl md:text-5xl font-recoleta font-bold text-[#0A66C2]">
                        ${prices[selectedPeriod]}
                      </div>
                      <div className="text-xl text-gray-600">
                        {selectedPeriod === 'annual' ? 'per month, billed annually ($348/yr)' : 'per month'}
                      </div>
                    </div>
                    <Link href="/sign-up">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="w-full font-outfit text-lg px-6 py-4 rounded-2xl mb-4 !bg-[#0A66C2] hover:!bg-[#0A66C2]/90 !text-white !border-none shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      >
                        <span className="flex items-center gap-3 justify-start">
                          Start 7-Day Free Trial <ArrowRight className="w-5 h-5" />
                        </span>
                      </Button>
                    </Link>
                  </div>
                  <ul className="space-y-4 mb-6 text-left">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-4">
                        <Check className="w-5 h-5 text-[#0A66C2] flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-outfit text-lg font-semibold text-gray-900">{
                            (feature === "Real-Time Analytics"
                              ? "Real time analytics"
                              : (feature.charAt(0) + feature.slice(1).toLowerCase()).replace(/linkedin/g, "LinkedIn").replace(/urls/g, "URLs").replace(/Urls/g, "URLs"))
                          }</span>
                          <p className="font-outfit text-sm text-gray-600 mt-1">
                            {feature === "Unlimited Contacts" && "Reach as many prospects as you want."}
                            {feature === "Unlimited Campaigns & Messages" && "No caps from us. You control the volume - we keep it safe."}
                            {feature === "Import LinkedIn Search URLs" && "Import from anywhere: LinkedIn search URLs, CSV files, post likes, post comments, and event attendees."}
                            {feature === "Advanced Targeting" && "Find exactly who you need."}
                            {feature === "Real-Time Analytics" && "Track replies, connections, and performance."}
                            {feature === "Built-In LinkedIn Protection" && "Human-like behavior. No plugins. No bans."}
                            {feature === "Duplicate Detection" && "Never message the same person twice."}
                            {feature === "Priority Support" && "Help when you need it."}
                            {feature === "AI-powered targeting included (coming soon)" && (
                              <>
                                <span className="font-outfit text-lg font-semibold text-gray-900">AI-powered targeting included <span className="text-xs text-gray-400 font-normal">(in beta)</span></span>
                                <p className="font-outfit text-sm text-gray-600 mt-1">Find your ideal prospects automatically</p>
                              </>
                            )}
                            {feature === "Secure by Design" && "You connect directly to LinkedIn. We never store your login or data unlike most tools. Your account stays private, protected, and under your control."}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
} 