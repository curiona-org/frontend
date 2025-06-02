"use client";

import { Dialog } from "radix-ui";

interface FinishedDialogProps {
  open: boolean;
  onClose: () => void;
}

const FinishedDialog = ({ open, onClose }: FinishedDialogProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
          <Dialog.Content className="bg-white-500 p-6 rounded-lg max-w-sm w-full shadow-lg animate-fadeIn">
            <Dialog.Title className="text-xl font-bold mb-4 text-center">
              Congratulations!
            </Dialog.Title>
            <p className="mb-4 text-center">
              You have successfully completed all topics and the roadmap! Keep
              up the great work and continue learning!
            </p>
            <div className="flex justify-center">
              <button
                className="px-4 py-2 bg-blue-600 text-white-500 rounded-lg hover:bg-blue-700 transition"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default FinishedDialog;
