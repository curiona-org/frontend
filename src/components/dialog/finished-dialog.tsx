"use client";
import { rateRoadmap } from "@/app/roadmap/[slug]/actions";
import Button from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { GetRoadmapOutput } from "@/types/api-roadmap";
import { DotLottiePlayer } from "@dotlottie/react-player";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import dayjs from "dayjs";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import RotatingLoader from "../loader/rotating-loader";

interface FinishedDialogProps {
  open: boolean;
  isFinished: boolean;
  onClose: () => void;
  onRated: (rating: number, comment: string) => void;
  slug: string;
  existingData: GetRoadmapOutput;
}

const FinishedDialog = ({
  isFinished,
  open,
  onClose,
  onRated,
  slug,
  existingData,
}: FinishedDialogProps) => {
  const [thoughts, setThoughts] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleStarClick = (star: number) => {
    setRating((prev) => (prev === star ? 0 : star));
    setErrorMessage(null);
  };

  useEffect(() => {
    if (existingData?.rating?.is_rated) {
      setRating(existingData.rating.rating);
      setThoughts(existingData.rating.comment);
    } else {
      setRating(0);
      setThoughts("");
    }
    setErrorMessage(null);
  }, [existingData, open]);

  const handleSubmit = async () => {
    if (rating === 0) {
      setErrorMessage("Please select at least 1 star");
      return;
    }
    setLoading(true);
    try {
      await rateRoadmap(slug, rating, thoughts);
      onRated(rating, thoughts);
      onClose();
    } catch (err) {
      console.error("Error submit rating", err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]" /> */}
        <Dialog.Content
          className='fixed left-1/2 top-1/2 w-80 md:w-[700px] lg:w-[465px] p-8 bg-white-500 border-2 border-blue-500 rounded-2xl shadow-lg -translate-x-1/2 -translate-y-1/2 outline-none'
          onOpenAutoFocus={(event) => {
            if (isMobile) {
              event.preventDefault();
            }
          }}
        >
          <VisuallyHidden>
            <Dialog.Title>Congratulations - Rate the Roadmap</Dialog.Title>
          </VisuallyHidden>
          <div className='flex flex-col gap-4 items-center'>
            {isFinished && (
              <>
                <DotLottiePlayer
                  src='/clap.lottie'
                  className='w-32'
                  loop
                  autoplay
                />
                <h2 className='text-mobile-heading-2 lg:text-heading-2 font-bold text-center'>
                  Congratulations!
                </h2>
                <p className='text-mobile-body-1-regular lg:text-body-1-regular text-center'>
                  You have successfully completed the roadmap. Keep up the great
                  work and continue learning!
                </p>
                <div className='relative dashedLine_2 w-full inset-0'></div>
              </>
            )}
            <h4 className='text-mobile-heading-4-regular lg:text-heading-4-regular'>
              {existingData?.rating?.is_rated &&
                "Want to update your rating? 🎖️"}
              {!existingData?.rating?.is_rated && "Rate this roadmap 🎖️"}
            </h4>
            {existingData?.rating?.is_rated &&
              existingData.rating.progression_total_finished_topics !==
                existingData.rating.progression_total_topics && (
                <p className='text-mobile-body-1-regular lg:text-body-1-regular text-center'>
                  Last rated when you had{" "}
                  <span className='font-bold text-blue-500'>
                    {(
                      (existingData.rating.progression_total_finished_topics /
                        existingData.rating.progression_total_topics) *
                      100
                    ).toFixed(0)}
                    %
                  </span>{" "}
                  of the roadmap completed on{" "}
                  {dayjs(existingData.rating.created_at).format("D MMM YYYY")}
                </p>
              )}
            {existingData?.rating?.is_rated &&
              existingData.rating.progression_total_finished_topics ===
                existingData.rating.progression_total_topics && (
                <p className='text-mobile-body-1-regular lg:text-body-1-regular text-center'>
                  Your feedback is still valuable! Please consider updating your
                  rating if your experience has changed.
                </p>
              )}
            {!existingData?.rating?.is_rated && !isFinished && (
              <p className='text-mobile-body-1-regular lg:text-body-1-regular text-center'>
                {`Your haven't completed this roadmap yet, but your feedback is
                still valuable! Please rate it based on your current experience.`}
              </p>
            )}
            {!existingData?.rating?.is_rated && isFinished && (
              <p className='text-mobile-body-1-regular lg:text-body-1-regular text-center'>
                Your feedback is valuable! Please rate this roadmap based on
                your overall experience.
              </p>
            )}
            {/* Rating Stars */}
            <div className='flex gap-2 mb-4 cursor-pointer'>
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className='flex items-center'
                >
                  {rating >= star ? (
                    <svg
                      className='w-12'
                      viewBox='0 0 48 49'
                      fill='var(--yellow-500)'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M21.1356 7.07571C21.3998 6.54003 21.8086 6.08897 22.3158 5.77357C22.823 5.45817 23.4084 5.29102 24.0056 5.29102C24.6029 5.29102 25.1883 5.45817 25.6955 5.77357C26.2027 6.08897 26.6115 6.54003 26.8756 7.07571L31.3236 16.0837L41.2676 17.5277C41.8588 17.6135 42.4141 17.8631 42.8707 18.2482C43.3274 18.6333 43.6671 19.1385 43.8515 19.7067C44.0359 20.2748 44.0576 20.8833 43.9141 21.4631C43.7706 22.043 43.4677 22.5711 43.0396 22.9877L36.3436 29.9997L38.0436 39.9037C38.1447 40.492 38.0793 41.0969 37.8547 41.6499C37.6301 42.203 37.2552 42.6822 36.7726 43.0334C36.2899 43.3846 35.7186 43.5937 35.1232 43.6373C34.5279 43.6808 33.9323 43.557 33.4036 43.2797L24.5036 38.5997L15.6076 43.2797C15.079 43.557 14.4833 43.6808 13.888 43.6373C12.7927 43.5937 12.2214 43.3846 11.7387 43.0334C11.256 42.6822 10.8812 42.203 10.6566 41.6499C10.932 41.0969 10.8665 40.492 10.9676 39.9037L12.6636 29.9997L5.46763 22.9877C5.03948 22.5708 4.73662 22.0424 4.59334 21.4622C4.45006 20.8821 4.47209 20.2734 4.65694 19.7052C4.84178 19.1369 5.18205 18.6317 5.63921 18.2469C6.09638 17.8621 6.65216 17.6129 7.24363 17.5277L17.1876 16.0877L21.6356 7.07571Z' />
                    </svg>
                  ) : (
                    <svg
                      className='w-12'
                      viewBox='0 0 48 49'
                      fill='var(--black-100)'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M21.1356 7.07571C21.3998 6.54003 21.8086 6.08897 22.3158 5.77357C22.823 5.45817 23.4084 5.29102 24.0056 5.29102C24.6029 5.29102 25.1883 5.45817 25.6955 5.77357C26.2027 6.08897 26.6115 6.54003 26.8756 7.07571L31.3236 16.0837L41.2676 17.5277C41.8588 17.6135 42.4141 17.8631 42.8707 18.2482C43.3274 18.6333 43.6671 19.1385 43.8515 19.7067C44.0359 20.2748 44.0576 20.8833 43.9141 21.4631C43.7706 22.043 43.4677 22.5711 43.0396 22.9877L36.3436 29.9997L38.0436 39.9037C38.1447 40.492 38.0793 41.0969 37.8547 41.6499C37.6301 42.203 36.7552 42.6822 36.2726 43.0334C35.7899 43.3846 35.2186 43.5937 34.6232 43.6373C34.0279 43.6808 33.9323 43.557 32.9036 43.2797L24.0036 38.5997L15.6076 43.2797C15.079 43.557 14.4833 43.6808 13.888 43.6373C12.7927 43.5937 12.2214 43.3846 11.7387 43.0334C11.256 42.6822 10.8812 42.203 10.6566 41.6499C10.432 41.0969 10.3665 40.492 10.4676 39.9037L12.1636 29.9997L4.96763 22.9877C4.53948 22.5708 4.23662 22.0424 4.09334 21.4622C3.95006 20.8821 3.97209 20.2734 4.15694 19.7052C4.34178 19.1369 4.68205 18.6317 5.13921 18.2469C5.59638 17.8621 6.15216 17.6129 6.74363 17.5277L16.6876 16.0877L21.1356 7.07571Z' />
                    </svg>
                  )}
                </div>
              ))}
            </div>

            {errorMessage && (
              <p className='text-red-500 text-mobile-body-1-regular lg:text-body-1-regular'>
                {errorMessage}
              </p>
            )}

            <input
              autoFocus={!isMobile}
              type='text'
              placeholder='Share your thoughts about this roadmap'
              className='text-mobile-body-1-regular lg:text-body-1-regular w-full p-4 border-2 border-white-600 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              maxLength={500}
            />
            {/* Button submit */}
            <div className='w-full text-mobile-body-1-medium lg:text-body-1-medium'>
              <Button
                className='w-full py-3 bg-blue-500 active:bg-blue-900 text-white-500'
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <RotatingLoader className='size-6 border-[3px] border-white-500' />
                ) : (
                  "Submit 👊"
                )}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default FinishedDialog;
