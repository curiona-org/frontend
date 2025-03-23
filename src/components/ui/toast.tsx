"use client";
import { cn } from "@/lib/helpers/common.helper";
import { Toast as ToastPrimitive } from "radix-ui";
import { forwardRef, useImperativeHandle, useState } from "react";

export type ToastToggleOptions = {
  type: "success" | "info" | "error";
  title: string;
  description: string;
};

export type ToastRef = {
  isOpened: boolean;
  open: (opt: ToastToggleOptions) => void;
  close: () => void;
};

const Toast = forwardRef<ToastRef, ToastPrimitive.ToastProps>(
  (props, forwardedRef) => {
    const [open, setIsOpened] = useState(false);
    const [title, setTitle] = useState("");
    const [type, setType] = useState<ToastToggleOptions["type"]>("info");
    const [description, setDescription] = useState<React.ReactNode | null>(
      null
    );

    useImperativeHandle(forwardedRef, () => ({
      isOpened: open,
      open: ({ title, type, description }: ToastToggleOptions) => {
        setType(type);
        setTitle(title);
        setDescription(description);
        setIsOpened(true);
      },
      close: () => setIsOpened(false),
    }));

    return (
      <ToastPrimitive.Root
        {...props}
        open={open}
        onOpenChange={setIsOpened}
        className={cn(
          "grid grid-cols-[auto_max-content] items-center text-white border-[3px] rounded-2xl shadow-lg duration-200 hover:brightness-90 data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-fadeIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]",
          {
            "border-blue-800 bg-blue-600": type === "info",
            "border-green-800 bg-green-600": type === "success",
            "border-red-800 bg-red-600": type === "error",
          }
        )}
      >
        <ToastPrimitive.Close className='flex flex-col text-left items-start p-4'>
          <div className='flex flex-row space-x-2'>
            <span>x</span>
            <ToastPrimitive.Title>
              <span className='opacity-70'>{title}</span>
            </ToastPrimitive.Title>
          </div>
          <ToastPrimitive.Description>{description}</ToastPrimitive.Description>
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
    );
  }
);

Toast.displayName = "Toast";

export default Toast;
