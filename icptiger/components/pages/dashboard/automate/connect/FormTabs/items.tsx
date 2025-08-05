import { Cookie, KeyRound } from "lucide-react";
import { Tab } from "./types";

/**
 * Represents an array of tab configurations for the dashboard scale connect form.
 * Each tab contains a label, an icon, and a unique value identifier.
 *
 * @constant
 * @type {Tab[]}
 *
 * @property {string} label - The display label for the tab.
 * @property {JSX.Element} icon - The icon component displayed alongside the label.
 * @property {string} value - A unique identifier for the tab.
 */

export const tabs: Tab[] = [
  {
    label: "Login & Password",
    icon: <KeyRound className="w-4 h-4" />,
    value: "login",
  },
  {
    label: "Cookies",
    icon: <Cookie className="w-4 h-4" />,
    value: "cookies",
  },
];