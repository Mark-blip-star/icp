import { Info } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

/**
 * HelpAlert component to assist users with locating LinkedIn cookies.
 * 
 * Displays an info icon, explanatory text, and a link to a help guide.
 * 
 * @component
 * @returns {JSX.Element} A styled alert box with help information.
 */
export const HelpAlert = (): JSX.Element => {
  const guideLink = useMemo(() => "/dashboard/scale/connect/help", []);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
      <div className="flex-shrink-0 text-blue-500 mt-0.5">
        <Info className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="text-sm text-blue-900">
        <p className="font-medium">Need help finding your LinkedIn cookies?</p>
        <p>
          Follow our easy step-by-step guide to locate and copy your session tokens securely.{" "}
          <Link
            href={guideLink}
            className="underline text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Read the guide →
          </Link>
        </p>
      </div>
    </div>
  );
};
