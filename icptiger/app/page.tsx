import Features from "@/app/(home)/features";
import Footer from "@/app/(home)/footer";
import Header from "@/app/(home)/header";
import Hero from "@/app/(home)/hero";
import HeroVideos from "@/app/(home)/hero-videos";
import DemoVideo from "@/app/(home)/demo-video";
import SocialProof from "@/app/(home)/social-proof";
import Testimonials from "./(home)/testimonials";
import SafetySection from "./(home)/SafetySection";
import ContentGeneration from "./(home)/content-generation";
import FAQ from "@/app/(home)/FAQ";
import WhyTiger from "@/app/(home)/why-tiger";
import UseCases from "@/app/(home)/use-cases";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getFeatureFlags } from "@/lib/feature-flags";

export default async function Index() {
  const featureFlags = getFeatureFlags();

  return (
    <div className="overflow-x-hidden flex flex-col min-h-screen">
      <main className="flex flex-col w-full p-4 pb-0 md:p-0 flex-grow">
        <Header />
        <div className="pt-6 md:pt-10">
          <Hero />
          {/* <div className="mt-16 md:mt-24">
            <DemoVideo />
          </div> */}
          <div className="mt-16 md:mt-24">
            <Testimonials />
          </div>
          <div className="mt-16 md:mt-24">
            <Features />
          </div>
          {featureFlags.showVideoDemos && (
            <div className="mt-16 md:mt-24">
              <HeroVideos />
            </div>
          )}
          <div className="mt-16 md:mt-24">
            <SafetySection />
          </div>
          <div className="mt-16 md:mt-24">
            <WhyTiger />
          </div>
          <div className="mt-16 md:mt-24">
            <UseCases />
          </div>
          <div className="mt-16 md:mt-24 mb-24">
            <FAQ />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
