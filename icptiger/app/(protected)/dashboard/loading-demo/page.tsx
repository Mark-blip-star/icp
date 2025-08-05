"use client";

import { Loading, LoadingSpinner, LoadingDots, LoadingPulse, LoadingWave, LoadingBounce } from "@/components/ui/loading";

export default function LoadingDemoPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-recoleta font-black text-gray-900 mb-8 tracking-tight">
        Loading Components Demo
      </h1>
      
      <div className="space-y-12">
        {/* Spinner Variants */}
        <section>
          <h2 className="text-2xl font-recoleta font-black text-gray-800 mb-6 tracking-tight">Spinner Variants</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-200">
              <LoadingSpinner size="sm" color="primary" />
              <span className="text-sm font-outfit text-gray-600">Small Primary</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-200">
              <LoadingSpinner size="md" color="primary" />
              <span className="text-sm font-outfit text-gray-600">Medium Primary</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-200">
              <LoadingSpinner size="lg" color="primary" />
              <span className="text-sm font-outfit text-gray-600">Large Primary</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-200">
              <LoadingSpinner size="xl" color="primary" />
              <span className="text-sm font-outfit text-gray-600">Extra Large Primary</span>
            </div>
          </div>
        </section>

        {/* Color Variants */}
        <section>
          <h2 className="text-2xl font-recoleta font-black text-gray-800 mb-6 tracking-tight">Color Variants</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-200">
              <LoadingSpinner size="md" color="primary" />
              <span className="text-sm font-outfit text-gray-600">Primary</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-200">
              <LoadingSpinner size="md" color="secondary" />
              <span className="text-sm font-outfit text-gray-600">Secondary</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-gray-800 rounded-xl border border-gray-200">
              <LoadingSpinner size="md" color="white" />
              <span className="text-sm font-outfit text-gray-300">White</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-200">
              <LoadingSpinner size="md" color="black" />
              <span className="text-sm font-outfit text-gray-600">Black</span>
            </div>
          </div>
        </section>

        {/* Animation Variants */}
        <section>
          <h2 className="text-2xl font-recoleta font-black text-gray-800 mb-6 tracking-tight">Animation Variants</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-200">
              <LoadingSpinner size="md" color="primary" />
              <span className="text-sm font-outfit text-gray-600">Spinner</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-200">
              <LoadingDots size="md" color="primary" />
              <span className="text-sm font-outfit text-gray-600">Dots</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-200">
              <LoadingPulse size="md" color="primary" />
              <span className="text-sm font-outfit text-gray-600">Pulse</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-200">
              <LoadingWave size="md" color="primary" />
              <span className="text-sm font-outfit text-gray-600">Wave</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-200">
              <LoadingBounce size="md" color="primary" />
              <span className="text-sm font-outfit text-gray-600">Bounce</span>
            </div>
          </div>
        </section>

        {/* With Text */}
        <section>
          <h2 className="text-2xl font-recoleta font-black text-gray-800 mb-6 tracking-tight">With Text</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-200">
              <LoadingSpinner size="lg" color="primary" text="Loading dashboard..." />
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-200">
              <LoadingDots size="lg" color="primary" text="Processing data..." />
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-200">
              <LoadingWave size="lg" color="primary" text="Connecting..." />
            </div>
          </div>
        </section>

        {/* Real-world Examples */}
        <section>
          <h2 className="text-2xl font-recoleta font-black text-gray-800 mb-6 tracking-tight">Real-world Examples</h2>
          <div className="space-y-6">
            {/* Dashboard Loading */}
            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-lg font-recoleta font-black text-gray-800 mb-4 tracking-tight">Dashboard Loading</h3>
              <div className="flex items-center justify-center h-32">
                <LoadingSpinner size="xl" color="primary" text="Loading dashboard..." />
              </div>
            </div>

            {/* Button Loading */}
            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-lg font-recoleta font-black text-gray-800 mb-4 tracking-tight">Button Loading</h3>
              <div className="flex items-center gap-4">
                <button className="px-6 py-3 bg-[#0A66C2] text-white rounded-lg flex items-center gap-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Connecting...</span>
                </button>
                <button className="px-6 py-3 bg-black text-white rounded-lg flex items-center gap-2">
                  <LoadingDots size="sm" color="white" />
                  <span>Generating...</span>
                </button>
              </div>
            </div>

            {/* Metrics Loading */}
            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-lg font-recoleta font-black text-gray-800 mb-4 tracking-tight">Metrics Loading</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-inter font-bold text-black mb-2">
                    <LoadingDots size="sm" color="primary" />
                  </div>
                  <p className="text-sm text-gray-600 font-outfit">Contacts Imported</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-inter font-bold text-black mb-2">
                    <LoadingDots size="sm" color="primary" />
                  </div>
                  <p className="text-sm text-gray-600 font-outfit">Connections Sent</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-inter font-bold text-black mb-2">
                    <LoadingDots size="sm" color="primary" />
                  </div>
                  <p className="text-sm text-gray-600 font-outfit">Acceptance Rate</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 