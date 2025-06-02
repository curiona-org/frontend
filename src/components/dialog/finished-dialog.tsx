"use client";
import { Dialog } from "radix-ui";
import { DotLottiePlayer } from "@dotlottie/react-player";
import { useEffect } from "react";

const FinishedDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  // tetap gunakan timer otomatis untuk tutup
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => onClose(), 4800);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[400px] p-6 bg-white-500 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2 outline-none">
          <div className="flex flex-col items-center">
            <DotLottiePlayer
              src="/clap.lottie"
              className="w-32"
              loop
              autoplay
            />
            <h2 className="text-xl font-bold mb-4 text-center">
              Congratulations!
            </h2>
            <p className="mb-4 text-center">
              You have successfully completed the roadmap! Keep up the great
              work and continue learning!
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
export default FinishedDialog;
