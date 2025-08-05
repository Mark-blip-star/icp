import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { useMemo } from "react";
import { FormMethod } from "./types";
import { tabs } from "./items";

/**
 * A functional component that renders a set of tabs for a form, allowing users to switch between different methods.
 *
 * @param {Object} props - The props for the `FormTabs` component.
 * @param {FormMethod} props.method - The currently selected form method.
 * @param {(method: FormMethod) => void} props.onSwitch - A callback function triggered when a tab is clicked, 
 * which switches the form method.
 *
 * @returns {JSX.Element} A styled tab component with buttons for switching between form methods.
 *
 * @remarks
 * - The component uses `useMemo` to optimize rendering of tabs.
 * - Each tab is styled dynamically based on whether it is active or not.
 * - The `Button` component is used for each tab, with hover and active states styled for better user experience.
 *
 * @example
 * ```tsx
 * <FormTabs
 *   method="email"
 *   onSwitch={(newMethod) => {}}
 * />
 * ```
 */

export const FormTabs = ({
  method,
  onSwitch,
}: {
  method: FormMethod;
  onSwitch: (method: FormMethod) => void;
}) => {
  const renderTabs = useMemo(
    () =>
      tabs.map(({ label, icon, value }) => {
        const isActive = method === value;
        return (
          <Button
            key={value}
            onClick={() => onSwitch(value)}
            type="button"
            variant="ghost"
            className={cn(
              "w-full justify-start rounded-lg text-base transition-all font-fraunces",
              "py-6 px-5 flex items-center gap-4",
              "hover:bg-[#FFF5EA] hover:text-black hover:scale-[0.98] active:scale-[0.96]",
              isActive
                ? "bg-gradient-to-r from-[#FFE8D5] via-[#FFF5EA] to-[#FFE8D5] text-black font-medium shadow-[2px_2px_black]"
                : "bg-black text-white"
            )}
          >
            {icon}
            <span>{label}</span>
          </Button>
        );
      }),
    [method, onSwitch]
  );

  return (
    <div className="flex justify-center mb-4 rounded-lg overflow-hidden max-w-md mx-auto">
      <div className="flex bg-black p-1 rounded-xl gap-1">{renderTabs}</div>
    </div>
  );
};
