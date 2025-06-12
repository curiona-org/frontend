"use clinet";
import RotatingLoader from "@/components/loader/rotating-loader";
import Button from "@/components/ui/button";
import { toast } from "@/components/ui/toast-sonner";
import { handleCurionaError } from "@/lib/error";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { useState } from "react";

const roadmapService = new RoadmapService();

interface DeleteDialogProps {
  slug: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DeleteDialog = ({ slug, open, onClose }: DeleteDialogProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDeleteRoadmap = async () => {
    setLoading(true);
    try {
      const response = await roadmapService.deleteRoadmapBySlug(slug);

      if (!response.success) {
        toast({
          type: "error",
          title: "Error",
          description: response.message || "Failed to delete roadmap",
        });
        return;
      } else {
        toast({
          type: "success",
          title: "Success",
          description: "Roadmap deleted successfully",
        });
        router.push("/");
      }
    } catch (error) {
      const err = handleCurionaError(error);
      toast({
        type: "error",
        title: "Error",
        description:
          err.message ||
          "There was a problem on our end. Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className='z-[100] fixed inset-0 bg-[#3C3C3C]/10 backdrop-blur-sm data-[state=open]:animate-fadeIn overflow-y-auto'>
          <Dialog.Content className='flex flex-col gap-4 fixed left-1/2 top-1/2 w-80 md:w-[700px] lg:w-[800px] h-fit overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white-500 border-2 border-blue-500 p-10 text-blue-900 shadow-lg outline-none data-[state=open]:animate-fadeIn transition-all'>
            <Dialog.Title className='text-mobile-heading-2 lg:text-heading-2'>
              Are you sure you want to delete this roadmap? 🥹
            </Dialog.Title>

            <p className='text-mobile-body-1-regular lg:text-body-1-regular'>
              {`This action will permanently remove your current roadmap. You
              won't be able to undo.`}
            </p>

            <div className='flex flex-col-reverse md:flex-row justify-between gap-6 text-mobile-body-1-medium lg:text-body-1-medium'>
              <Button
                className='w-full p-3 text-black-100 border-2 border-white-600'
                onClick={onClose}
                aria-label='Close Chat'
                title='Close Chat'
              >
                Cancel
              </Button>
              <Button
                className='w-full p-3 text-white-500 bg-red-500 flex items-center justify-center'
                onClick={handleDeleteRoadmap}
                aria-label='Close Chat'
                title='Close Chat'
              >
                {loading && (
                  <RotatingLoader className='size-6 border-[3px] border-white-500' />
                )}
                {!loading && "Delete roadmap 🚮"}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteDialog;
