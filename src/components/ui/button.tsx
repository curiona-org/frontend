import { cn } from "@/lib/helpers/common.helper";
import { Slot } from "radix-ui";
import { forwardRef } from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  disableEffects?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild, disableEffects = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "button";
    return (
      <Comp
        className={cn(
          className,
          "rounded-lg shadow-lg",
          !disableEffects &&
            "transition-transform duration-300 ease-out hover:scale-105 active:scale-95"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
