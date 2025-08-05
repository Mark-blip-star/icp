"use client";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Menu, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { useEffect, useState } from "react";
import { isUserAuthenticated } from "../actions/auth";
import { useFeatureFlags } from "@/lib/feature-flags";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const featureFlags = useFeatureFlags();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await isUserAuthenticated();
        setIsAuthenticated(!!user);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "Pricing", href: "/pricing" },
  ];

  // Show a placeholder with the same dimensions while loading
  if (isLoading) {
    return (
      <div className="w-full px-4 py-4 md:py-6 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <header className="flex justify-between items-center max-w-7xl mx-auto py-2 md:py-3">
          <div className="h-[65px] w-[180px] bg-gray-100 animate-pulse rounded" />
          <div className="hidden md:flex items-center gap-8">
            <div className="h-4 w-16 bg-gray-100 animate-pulse rounded" />
            <div className="h-4 w-16 bg-gray-100 animate-pulse rounded" />
            <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
            <div className="h-10 w-32 bg-gray-100 animate-pulse rounded-2xl" />
          </div>
          <div className="md:hidden h-10 w-10 bg-gray-100 animate-pulse rounded-full" />
        </header>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-4 md:py-6 sticky top-0 bg-white/80 backdrop-blur-md z-50">
      <header className="flex justify-between items-center max-w-7xl mx-auto py-2 md:py-3 transition-all">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Image
            src="/images/logo.png"
            alt="ICP Tiger"
            width={300}
            height={112}
            priority
            className="h-[65px] w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-outfit text-base font-medium text-gray-700 hover:text-[#0A66C2] transition-colors duration-200 relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0A66C2] transition-all duration-200 group-hover:w-full"></span>
            </Link>
          ))}
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button 
                className="!bg-[#0A66C2] !text-white hover:!bg-[#0A66C2]/90 border-2 border-[#0A66C2] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2.5 font-outfit font-semibold text-sm hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  Dashboard
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button 
                className="!bg-white !text-[#0A66C2] hover:!bg-[#0A66C2] hover:!text-white border-2 border-[#0A66C2] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2.5 font-outfit font-semibold text-sm hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </Link>
          )}
          {featureFlags.showAuthOptions && isAuthenticated && (
            <div className="relative group">
              <Link href="/dashboard" className="inline-flex items-center gap-1.5 font-outfit text-sm font-medium text-black/80 hover:text-black transition-colors">
                Dashboard
                <svg className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden hover:bg-black/5 rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[280px] sm:w-[320px] border-none bg-white/95 backdrop-blur-md">
            <SheetHeader>
              <SheetTitle className="font-outfit font-medium text-xl">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 mt-6">
              {navigation.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="font-outfit text-lg font-medium text-gray-700 hover:text-[#0A66C2] transition-colors duration-200 p-3 hover:bg-gray-50 rounded-lg"
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button 
                    className="!bg-[#0A66C2] !text-white hover:!bg-[#0A66C2]/90 border-2 border-[#0A66C2] rounded-2xl transition-all duration-300 px-6 py-2.5 font-outfit font-semibold text-sm mt-6 w-fit hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-in">
                  <Button 
                    className="!bg-white !text-[#0A66C2] hover:!bg-[#0A66C2] hover:!text-white border-2 border-[#0A66C2] rounded-2xl transition-all duration-300 px-6 py-2.5 font-outfit font-semibold text-sm mt-6 w-fit hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </Link>
              )}
              {featureFlags.showAuthOptions && isAuthenticated && (
                <Link href="/dashboard" className="inline-flex items-center gap-1.5 font-outfit text-sm font-medium text-black/80 hover:text-black mt-6 transition-colors">
                  Dashboard
                  <svg className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  );
}
