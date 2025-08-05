"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
export default function Footer() {

  return (
    <footer className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <h2 className="text-3xl font-recoleta font-bold text-[#0A66C2]">Tiger</h2>
            </Link>
            <p className="font-outfit text-lg text-gray-600 leading-relaxed">
              Hunt. Connect. Win.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/company/icptiger/" target="_blank" rel="noopener noreferrer" className="text-[#0A66C2] hover:text-[#0A66C2]/80 transition-colors p-2 hover:bg-gray-50 rounded-lg">
                <Linkedin className="w-6 h-6" />
              </a>

            </div>
          </div>

          {/* Menu & Legal Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            {/* Menu Section */}
            <div className="space-y-6">
              <h3 className="font-recoleta text-xl font-bold text-gray-900">Menu</h3>
              <div className="flex flex-col gap-4">
                <Link href="/" className="font-outfit text-lg text-gray-600 hover:text-[#0A66C2] transition-colors">
                  Home
                </Link>
                <Link href="/pricing" className="font-outfit text-lg text-gray-600 hover:text-[#0A66C2] transition-colors">
                  Pricing
                </Link>
                <Link href="/blog" className="font-outfit text-lg text-gray-600 hover:text-[#0A66C2] transition-colors">
                  Blog
                </Link>
              </div>
            </div>

            {/* Legal Section */}
            <div className="space-y-6">
              <h3 className="font-recoleta text-xl font-bold text-gray-900">Legal</h3>
              <div className="flex flex-col gap-4">
                <Link href="/privacy" className="font-outfit text-lg text-gray-600 hover:text-[#0A66C2] transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="font-outfit text-lg text-gray-600 hover:text-[#0A66C2] transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
