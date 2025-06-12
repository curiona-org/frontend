"use client";

import { cn } from "@/lib/utils";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  id: string | number;
  type: "success" | "info" | "error";
  title: string;
  description: string;
};

export function toast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      type={toast.type}
      title={toast.title}
      description={toast.description}
    />
  ));
}

export function toastDismissAll() {
  sonnerToast.dismiss();
}

function Toast(props: ToastProps) {
  const { type, title, description, id } = props;

  const symbolText: Record<ToastProps["type"], string> = {
    info: "ℹ️",
    success: "✅",
    error: "❌",
  };

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_max-content] items-center text-white bg-white-500 border-[3px] rounded-2xl shadow-lg duration-200 hover:brightness-90",
        {
          "border-blue-500 bg-blue-50": type === "info",
          "border-green-500 bg-green-50": type === "success",
          "border-red-500 bg-red-50": type === "error",
        }
      )}
    >
      <button
        onClick={() => {
          sonnerToast.dismiss(id);
        }}
      >
        <div className='flex flex-col gap-2 text-left items-start p-4'>
          <div className='flex flex-row space-x-2'>
            <span>{symbolText[type]}</span>
            <span
              className={cn(
                "text-mobile-heading-4-bold lg:text-heading-4-bold",
                {
                  "text-blue-600": type === "info",
                  "text-green-600": type === "success",
                  "text-red-600": type === "error",
                }
              )}
            >
              {title}
            </span>
          </div>
          <span className='text-mobile-body-1-medium lg:text-body-1-medium'>
            {description}
          </span>
        </div>
      </button>
    </div>
  );
}

export default Toast;
