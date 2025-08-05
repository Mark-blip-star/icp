import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full sm:text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#0A66C2] text-white border-none rounded-xl shadow-md hover:shadow-lg transition-all hover:bg-[#0A66C2]/90 font-outfit",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-retro-right hover:shadow-retro-right-hover",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-retro-right hover:shadow-retro-right-hover",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-7 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm",
        icon: "h-8 w-8 sm:h-10 sm:w-10",
        default: "h-11 px-6 py-2 sm:px-8 sm:py-3",
        lg: "h-11 px-6 text-base sm:h-12 sm:px-8 sm:text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
