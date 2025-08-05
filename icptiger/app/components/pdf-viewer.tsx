'use client';

import React, { useEffect, useState } from 'react';

interface PDFViewerProps {
  pdfUrl: string;
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full max-w-2xl h-[600px] rounded-lg shadow-lg bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading PDF viewer...</div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <object
        data={pdfUrl}
        type="application/pdf"
        className="w-full max-w-2xl h-[600px] rounded-lg shadow-lg"
      >
        <embed
          src={pdfUrl}
          type="application/pdf"
          className="w-full max-w-2xl h-[600px] rounded-lg shadow-lg"
        />
        <p>Unable to display PDF file. <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-[#0A66C2] underline">Download</a> instead.</p>
      </object>
    </div>
  );
}