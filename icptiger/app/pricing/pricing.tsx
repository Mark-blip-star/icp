"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isUserAuthenticated } from "../actions/auth";
import { Check, Sparkles, Pen, PenLine, ArrowRight, Brain, Image as ImageIcon, Bot, Users } from "lucide-react";
import { useFeatureFlags } from "@/lib/feature-flags";

type PricingPeriod = 'monthly' | '6months' | 'annual';

const yearlyPaymentLink =
  process.env.NODE_ENV == "development"
    ? "https://buy.stripe.com/test_14k00l8TT0uUfMk289"
    : "https://buy.stripe.com/14kdUr9uX6Afgtq5kk";
const monthlyPaymentLink =
  process.env.NODE_ENV == "development"
    ? "https://buy.stripe.com/test_bIY8wRgml7Xm57G6oo"
    : "https://buy.stripe.com/fZeeYvePh2jZcda9AB";

const premiumYearlyPaymentLink =
  process.env.NODE_ENV == "development"
    ? "https://buy.stripe.com/test_bIYaEZfihfpO1VueUX"
    : "https://buy.stripe.com/5kA4jR0Yr9Mr6SQdQX";
const premiumMonthlyPaymentLink =
  process.env.NODE_ENV == "development"
    ? "https://buy.stripe.com/test_14kcN79XX7XmdEc28a"
    : "https://buy.stripe.com/cN28A77mPcYD1yw3ci";

const prices = {
  monthly: 39,
  '6months': 15,
  annual: 29,
} as const;

const savings: Record<PricingPeriod, number> = {
  monthly: 0,
  '6months': Math.round((1 - 15/19) * 100),
  annual: Math.round((1 - 29/39) * 100)
};

const features = [
  "Unlimited LinkedIn campaigns",
  "AI-powered message personalization",
  "Advanced targeting filters",
  "Multi-step automation flows",
  "Real-time analytics dashboard",
  "Priority support"
];

const getPaymentLink = (period: PricingPeriod, userEmail: string | null) => {
  const baseUrl = period === 'annual' ? yearlyPaymentLink : monthlyPaymentLink;
  return userEmail ? `${baseUrl}?prefilled_email=${encodeURIComponent(userEmail)}` : baseUrl;
};

export default function Pricing() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PricingPeriod>('annual');
  const { showTrustedBySection } = useFeatureFlags();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await isUserAuthenticated();
      setUserEmail(user?.email ?? null);
    };

    fetchUser();
  }, []);

  return (
    <section id="pricing" className="flex flex-col items-center justify-center mx-auto px-4 relative py-16 md:py-24">
      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto mb-32 relative">
        <div className="flex flex-col items-center text-center gap-8 md:gap-12">
          <h1 className="font-rufina text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black max-w-4xl flex flex-col items-center gap-6 tracking-tight">
            <span className="inline-block px-5 py-2 bg-gradient-to-r from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4] rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Grow 10x Faster
            </span>
            <span>It's less than $1 a day for cracked LinkedIn automation.</span>
          </h1>

          {/* Subtitle */}
          <p className="font-outfit font-light text-xl sm:text-2xl md:text-3xl text-center max-w-[90%] sm:max-w-2xl mx-auto">
            Join thousands of entrepreneurs and startups using Ciela to automate their LinkedIn growth, starting at just <span className="font-semibold">$39/month</span>
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center justify-center gap-4">
            <Link href={getPaymentLink('annual', userEmail)} className="inline-block">
              <Button 
                variant="outline"
                size="lg" 
                className="font-outfit text-xl sm:text-2xl px-8 py-6 bg-gradient-to-r from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4] rounded-xl border-2 border-black text-black shadow-[4px_4px_black] hover:shadow-[2px_2px_black] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-200"
              >
                <span className="flex items-center gap-3">
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </Link>
            <p className="font-outfit text-black/60">
              No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* Most Affordable Solution Section */}
      <div className="w-full max-w-5xl mx-auto mb-32">
        <div className="text-center mb-12">
          <h2 className="font-rufina text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6">
            <span className="text-[#9A7B4F]">The Most Affordable</span> Solution
            <span className="block text-xl sm:text-2xl md:text-3xl mt-4 text-black/60 font-outfit">that gets the job done</span>
          </h2>
          <p className="font-outfit text-lg sm:text-xl md:text-2xl text-black/80 max-w-3xl mx-auto">
            We believe in making LinkedIn automation accessible to everyone. While others charge premium prices for basic features, we offer a complete solution at a fraction of the cost.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Our Solution */}
          <div className="relative">
            <div className="absolute -top-3 -right-3">
              <div className="bg-black text-white px-4 py-1 rounded-full font-outfit text-sm border-2 border-black">
                Best Value
              </div>
            </div>
            <div className="h-full bg-gradient-to-r from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4] rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-outfit text-2xl font-bold">Ciela</h3>
                  <p className="font-outfit text-lg text-black/60">Your LinkedIn copilot</p>
                </div>
                <div className="text-right">
                  <div className="font-outfit text-3xl font-bold text-[#9A7B4F]">$39</div>
                  <div className="font-outfit text-lg text-black/60">per month</div>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#9A7B4F]" />
                  <span className="font-outfit text-lg">Cloud-based (works 24/7)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#9A7B4F]" />
                  <span className="font-outfit text-lg">Unlimited campaigns & connections</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#9A7B4F]" />
                  <span className="font-outfit text-lg">AI content generation included</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#9A7B4F]" />
                  <span className="font-outfit text-lg">Simple, intuitive interface</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Market Comparison */}
          <div className="bg-white rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <h3 className="font-outfit text-2xl font-bold mb-6">Other Solutions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div>
                  <div className="font-outfit text-lg font-medium">Botdog</div>
                  <div className="font-outfit text-base text-black/60">Cloud-based, straightforward</div>
                </div>
                <div className="text-right">
                  <div className="font-outfit text-lg font-medium">$39/mo</div>
                  <div className="font-outfit text-base text-black/60">$19.99/mo annually</div>
                </div>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div>
                  <div className="font-outfit text-lg font-medium">Linked Helper</div>
                  <div className="font-outfit text-base text-black/60">Desktop-based only</div>
                </div>
                <div className="text-right">
                  <div className="font-outfit text-lg font-medium">$15-45/mo</div>
                  <div className="font-outfit text-base text-black/60">Computer must stay on</div>
                </div>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div>
                  <div className="font-outfit text-lg font-medium">Waalaxy</div>
                  <div className="font-outfit text-base text-black/60">Chrome extension</div>
                </div>
                <div className="text-right">
                  <div className="font-outfit text-lg font-medium">$43-131/mo</div>
                </div>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div>
                  <div className="font-outfit text-lg font-medium">Dripify</div>
                  <div className="font-outfit text-base text-black/60">Limited basic tier</div>
                </div>
                <div className="text-right">
                  <div className="font-outfit text-lg font-medium">$59-99/mo</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-outfit text-lg font-medium">Expandi</div>
                  <div className="font-outfit text-base text-black/60">Extra cost for basic features</div>
                </div>
                <div className="text-right">
                  <div className="font-outfit text-lg font-medium">$99/mo</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href={getPaymentLink('annual', userEmail)} className="inline-block">
            <Button 
              size="lg" 
              className="font-outfit text-xl px-8 py-6 bg-gradient-to-r from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4] text-black border-2 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:from-[#E8D5C4] hover:to-[#FFF5EA] shadow-[4px_4px_black] hover:shadow-[2px_2px_black] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-200"
            >
              <span className="flex items-center gap-3">
                Get Started for Just $39/mo
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Replace Your Entire Stack Section */}
      <div className="w-full max-w-7xl mb-24">
        <div className="text-center mb-16">
          <h2 className="font-rufina text-3xl sm:text-4xl md:text-5xl lg:text-6xl relative tracking-tight">
            Replace Your{" "}
            <span className="text-[#9A7B4F]">
              Entire Stack
            </span>
          </h2>
          <p className="font-outfit text-lg sm:text-xl md:text-2xl text-black/80 max-w-[90%] sm:max-w-3xl mx-auto mt-8">
            Your all-in-one LinkedIn growth automation tool consolidates the functionality of all these separate services - from AI content generation to visual content creation to LinkedIn automation
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: "EasyGen",
              description: "AI content generation and personalization",
              price: 49,
              features: ["Content creation", "Message personalization", "Campaign templates"]
            },
            {
              icon: <Brain className="w-6 h-6" />,
              title: "Claude/ChatGPT",
              description: "AI assistants for content creation",
              price: 20,
              features: ["Content ideation", "Post writing", "Manual formatting"]
            },
            {
              icon: <PenLine className="w-6 h-6" />,
              title: "Expandi",
              description: "LinkedIn automation and campaign management",
              price: 99,
              features: ["Profile targeting", "Connection automation", "Analytics dashboard"]
            },
            {
              icon: <ImageIcon className="w-6 h-6" />,
              title: "Midjourney/Ideogram",
              description: "AI image generation for social media",
              price: 30,
              features: ["Image generation", "Style customization", "Commercial rights"]
            },
            {
              icon: <Bot className="w-6 h-6" />,
              title: "Botdog",
              description: "LinkedIn automation and outreach",
              price: 49,
              features: ["Connection requests", "Message sequences", "Basic analytics"]
            },
            {
              icon: <Users className="w-6 h-6" />,
              title: "Linked Helper",
              description: "LinkedIn prospecting and outreach",
              price: 39,
              features: ["Profile visits", "Auto-endorsements", "Basic CRM"]
            }
          ].map((tool, index) => (
            <Card key={index} className="border-2 border-black bg-white backdrop-blur-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-[2px] hover:-translate-x-[2px] transition-all duration-200">
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4] border-2 border-black">
                      {tool.icon}
                    </div>
                    <h3 className="font-outfit text-xl font-bold">{tool.title}</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold">${tool.price}</span>
                    <span className="text-black/60 ml-1">/mo</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-outfit text-lg text-black/80 mb-4">{tool.description}</p>
                <ul className="space-y-3">
                  {tool.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-black/80" />
                      <span className="font-outfit text-base text-black/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Consolidation Message */}
        <div className="text-center mb-12">
          <div className="inline-block px-8 py-6 bg-gradient-to-r from-[#E8D5C4]/20 via-[#FFF5EA]/20 to-[#E8D5C4]/20 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-outfit text-lg sm:text-xl md:text-2xl text-black/80">
              Ciela consolidates <span className="font-medium">all these features</span> into one seamless platform:
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-1 text-[#9A7B4F]" />
                  <p className="font-outfit text-lg">
                    <span className="font-medium">AI Content Creation</span><br/>
                    <span className="text-base text-black/60">Replaces EasyGen & ChatGPT</span>
                  </p>
                </div>
                <div className="ml-7 mt-1">
                  <div className="inline-block px-2 py-1 bg-[#E8D5C4]/30 rounded-lg border border-black/40">
                    <span className="font-outfit text-base line-through text-black/40">$69/mo</span>
                    <span className="font-outfit text-base ml-2 text-[#9A7B4F]">→ Included</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-1 text-[#9A7B4F]" />
                  <p className="font-outfit text-lg">
                    <span className="font-medium">Visual Content Generation</span><br/>
                    <span className="text-base text-black/60">Replaces Midjourney/Ideogram</span>
                  </p>
                </div>
                <div className="ml-7 mt-1">
                  <div className="inline-block px-2 py-1 bg-[#E8D5C4]/30 rounded-lg border border-black/40">
                    <span className="font-outfit text-base line-through text-black/40">$30/mo</span>
                    <span className="font-outfit text-base ml-2 text-[#9A7B4F]">→ Included</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-1 text-[#9A7B4F]" />
                  <p className="font-outfit text-lg">
                    <span className="font-medium">LinkedIn Automation</span><br/>
                    <span className="text-base text-black/60">Replaces Expandi, Botdog & Linked Helper</span>
                  </p>
                </div>
                <div className="ml-7 mt-1">
                  <div className="inline-block px-2 py-1 bg-[#E8D5C4]/30 rounded-lg border border-black/40">
                    <span className="font-outfit text-base line-through text-black/40">$187/mo</span>
                    <span className="font-outfit text-base ml-2 text-[#9A7B4F]">→ Included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Card Section */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center pt-24 pb-24 relative min-h-screen">
        <div className="w-full max-w-[1400px] relative">
          {/* Floating Testimonials */}
          <div className="absolute inset-0 hidden lg:block pointer-events-none">
            {/* Left Side Testimonials */}
            <div className="absolute left-0 top-[58%] -translate-y-1/2 space-y-6 w-[320px]">
              <div style={{ animation: 'float 4s ease-in-out infinite' }}>
                <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8D5C4] border-2 border-black flex items-center justify-center flex-shrink-0">
                      <span className="font-outfit font-bold">JD</span>
                    </div>
                    <div>
                      <div className="font-outfit font-medium">John Doe</div>
                      <div className="font-outfit text-sm text-black/60">Sales Manager</div>
                    </div>
                  </div>
                  <p className="font-outfit text-sm text-black/80">
                    "This tool has completely transformed how I do LinkedIn outreach. The automation is seamless and the results are incredible."
                  </p>
                </div>
              </div>

              <div style={{ animation: 'float 4s ease-in-out infinite 1s' }}>
                <div className="bg-[#E8D5C4] rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center flex-shrink-0">
                      <span className="font-outfit font-bold">AS</span>
                    </div>
                    <div>
                      <div className="font-outfit font-medium">Alice Smith</div>
                      <div className="font-outfit text-sm text-black/60">Startup Entrepreneur</div>
                    </div>
                  </div>
                  <p className="font-outfit text-sm text-black/80">
                    "The AI-powered message personalization is a game-changer. My response rates have doubled since using this platform."
                  </p>
                </div>
              </div>

              <div style={{ animation: 'float 4s ease-in-out infinite 2s' }}>
                <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8D5C4] border-2 border-black flex items-center justify-center flex-shrink-0">
                      <span className="font-outfit font-bold">RJ</span>
                    </div>
                    <div>
                      <div className="font-outfit font-medium">Robert Johnson</div>
                      <div className="font-outfit text-sm text-black/60">Business Developer</div>
                    </div>
                  </div>
                  <p className="font-outfit text-sm text-black/80">
                    "Finally, a simple solution that actually works. No more juggling multiple tools or keeping my computer running 24/7."
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side Testimonials */}
            <div className="absolute right-0 top-[58%] -translate-y-1/2 space-y-6 w-[320px]">
              <div style={{ animation: 'float 4s ease-in-out infinite 0.5s' }}>
                <div className="bg-[#E8D5C4] rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center flex-shrink-0">
                      <span className="font-outfit font-bold">EW</span>
                    </div>
                    <div>
                      <div className="font-outfit font-medium">Emma Wilson</div>
                      <div className="font-outfit text-sm text-black/60">Marketing Lead</div>
                    </div>
                  </div>
                  <p className="font-outfit text-sm text-black/80">
                    "The best $10 I spend each month. It's replaced over $200 worth of other tools and works better than all of them combined."
                  </p>
                </div>
              </div>

              <div style={{ animation: 'float 4s ease-in-out infinite 1.5s' }}>
                <div className="bg-white rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8D5C4] border-2 border-black flex items-center justify-center flex-shrink-0">
                      <span className="font-outfit font-bold">MR</span>
                    </div>
                    <div>
                      <div className="font-outfit font-medium">Michael Ross</div>
                      <div className="font-outfit text-sm text-black/60">Sales Executive</div>
                    </div>
                  </div>
                  <p className="font-outfit text-sm text-black/80">
                    "I was skeptical about the price at first - it seemed too good to be true. But it's genuinely better than tools costing 10x more."
                  </p>
                </div>
              </div>

              <div style={{ animation: 'float 4s ease-in-out infinite 2.5s' }}>
                <div className="bg-[#E8D5C4] rounded-xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center flex-shrink-0">
                      <span className="font-outfit font-bold">SL</span>
                    </div>
                    <div>
                      <div className="font-outfit font-medium">Sarah Lee</div>
                      <div className="font-outfit text-sm text-black/60">Freelancer</div>
                    </div>
                  </div>
                  <p className="font-outfit text-sm text-black/80">
                    "The unlimited campaigns and AI features make this an absolute no-brainer. My LinkedIn game has never been stronger."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div className="flex flex-col items-center justify-center mx-auto max-w-[480px]">
            <div className="text-center mb-12">
              <h2 className="font-rufina text-4xl md:text-5xl lg:text-6xl mb-4">
                Get Started Today
              </h2>
              <p className="font-outfit text-lg md:text-xl text-black/80">
                All features included, no hidden fees
              </p>
            </div>

            <Card className="rounded-3xl border-2 w-full relative overflow-visible bg-gradient-to-br from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4] backdrop-blur-sm shadow-[6px_6px_black] hover:shadow-[8px_8px_black] transition-all duration-300 border-black group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.8)_0%,transparent_100%)] rounded-3xl pointer-events-none" />
              
              <div className="p-8 md:p-10 relative">
                {/* Billing Toggle */}
                <div className="flex flex-col items-center justify-center gap-4 mb-12">
                  <div className="grid grid-cols-3 gap-4 md:gap-5 w-full max-w-[400px]">
                    {(['monthly', '6months', 'annual'] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`relative px-1 py-2 rounded-xl font-outfit font-medium transition-all flex flex-col items-center ${
                          selectedPeriod === period
                            ? 'border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-r from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4] transform scale-[1.03]' 
                            : 'border-2 border-black/20 bg-white hover:border-black/40'
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {period === 'monthly' ? 'Monthly' : period === '6months' ? '6 Months' : 'Annual'}
                        </span>
                        {period === 'monthly' ? (
                          <span className="text-xs mt-1 font-medium text-black/60">Full price</span>
                        ) : (
                          <span className={`text-xs mt-1 font-bold ${selectedPeriod === period ? 'text-black' : 'text-black/70'}`}>
                            Save {savings[period]}%
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedPeriod !== 'monthly' && (
                    <p className="font-outfit text-sm text-black/60 font-medium mt-2">
                      {selectedPeriod === '6months' 
                        ? `Billed $${(15 * 6).toFixed(2)} every 6 months` 
                        : `Billed $${(29 * 12).toFixed(2)} annually`}
                    </p>
                  )}
                </div>

                {/* Price Display */}
                <div className="text-center mb-12">
                  <motion.div 
                    key={selectedPeriod}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative inline-block"
                  >
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-3xl font-medium text-black/60">$</span>
                      <span className="text-7xl font-bold text-black font-fraunces">
                        {prices[selectedPeriod]}
                      </span>
                      <div className="flex flex-col items-start">
                        <span className="text-xl text-black/60">/mo</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Features */}
                <div className="mb-10">
                  <h3 className="font-fraunces font-semibold text-xl text-black mb-6 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E8D5C4] to-[#FFF5EA] border-2 border-black flex items-center justify-center">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                    Everything included:
                  </h3>
                  <ul className="space-y-4">
                    {features.map((feature, i) => (
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex items-center gap-3 group"
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#E8D5C4] to-[#FFF5EA] border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <Check className="w-3 h-3 text-black" />
                        </div>
                        <span className="font-outfit text-base text-black/80 font-medium group-hover:text-black transition-colors duration-200">{feature}</span>
                      </motion.li>
                    ))}
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 group"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#E8D5C4] to-[#FFF5EA] border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-outfit text-base text-black/80 font-medium group-hover:text-black transition-colors duration-200">AI Post Generation</span>
                        <Badge variant="outline" className="bg-[#E8D5C4] text-black border-black">Free</Badge>
                      </div>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 group"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#E8D5C4] to-[#FFF5EA] border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-outfit text-base text-black/80 font-medium group-hover:text-black transition-colors duration-200">AI Image Generation</span>
                        <Badge variant="outline" className="bg-[#E8D5C4] text-black border-black">Free</Badge>
                      </div>
                    </motion.li>
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="space-y-4">
                  <Link className="block" href={getPaymentLink(selectedPeriod, userEmail)}>
                    <Button
                      variant="outline"
                      className="w-full font-outfit text-lg px-6 py-4 rounded-xl border-2 border-black bg-gradient-to-r from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4] text-black hover:from-[#E8D5C4] hover:to-[#FFF5EA] shadow-[4px_4px_black] hover:shadow-[2px_2px_black] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-200"
                      size="lg"
                    >
                      <span className="flex items-center gap-3">
                        Start Growing Your Network Today
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </Button>
                  </Link>
                  
                  <div className="flex items-center justify-center gap-4 font-outfit text-sm text-black/60">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M11.994 16H12.004" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>500 free credits monthly</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-black/20" />
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Cancel anytime</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FFF5EA] to-transparent pointer-events-none opacity-40" />

      {/* Trust Building Section */}
      {showTrustedBySection && (
        <div className="w-full max-w-7xl mx-auto mt-24 md:mt-32">
          <div className="text-center mb-16">
            <h2 className="font-rufina text-4xl md:text-5xl lg:text-6xl mb-6">
              Trusted by Entrepreneurs & Startups
            </h2>
            <p className="font-outfit text-lg md:text-xl text-black/80 max-w-2xl mx-auto">
              Join thousands of professionals growing their LinkedIn presence with our AI-powered platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Trust Signals */}
            <div className="bg-gradient-to-r from-[#E8D5C4]/30 via-[#FFF5EA]/30 to-[#E8D5C4]/30 backdrop-blur-sm rounded-2xl border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4] border-2 border-black flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-outfit text-xl font-semibold">500 Free Credits Monthly</h3>
              </div>
              <p className="font-outfit text-black/80">
                Start growing your network with 500 free credits every month - perfect for testing our powerful features and seeing real results.
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#E8D5C4]/30 via-[#FFF5EA]/30 to-[#E8D5C4]/30 backdrop-blur-sm rounded-2xl border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4] border-2 border-black flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15C15.866 15 19 11.866 19 8C19 4.134 15.866 1 12 1C8.13401 1 5 4.134 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-outfit text-xl font-semibold">Best-in-Class Support</h3>
              </div>
              <p className="font-outfit text-black/80">
                Get priority support from our expert team. We're here to help you succeed with personalized guidance.
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#E8D5C4]/30 via-[#FFF5EA]/30 to-[#E8D5C4]/30 backdrop-blur-sm rounded-2xl border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4] border-2 border-black flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-16">
            <div className="bg-gradient-to-r from-[#E8D5C4]/30 via-[#FFF5EA]/30 to-[#E8D5C4]/30 backdrop-blur-sm rounded-2xl border-2 border-black p-8 md:p-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="max-w-3xl mx-auto text-center">
                <p className="font-outfit text-xl md:text-2xl text-black/80 mb-8">
                  "Ciela has completely transformed how I approach LinkedIn. The AI-powered features save me hours each week, and the results have been incredible. Best investment I've made for my business growth."
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#E8D5C4] border-2 border-black flex items-center justify-center">
                    <span className="font-outfit font-bold">MK</span>
                  </div>
                  <div className="text-left">
                    <div className="font-outfit font-semibold">Michael Klein</div>
                    <div className="font-outfit text-sm text-black/60">Entrepreneur & CEO at TechFlow</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-16 text-center">
            <Link href={getPaymentLink('annual', userEmail)} className="inline-block">
              <Button 
                size="lg" 
                className="bg-black text-white border-2 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none transform hover:translate-y-[4px] hover:translate-x-[4px] transition-all duration-200 font-outfit text-lg px-10 py-6"
              >
                <span className="flex items-center gap-3">
                  Transform Your LinkedIn Presence
                  <ArrowRight className="h-6 w-6" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
} 