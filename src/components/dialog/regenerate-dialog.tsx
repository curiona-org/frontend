"use client";
import { regenerateRoadmap } from "@/app/roadmap/[slug]/actions";
import { ERROR_MESSAGES, handleCurionaError } from "@/lib/error";
import { SkillLevel, TimeUnit } from "@/types/personalization-options";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import RotatingLoader from "../loader/rotating-loader";
import Button from "../ui/button";
import { toast } from "../ui/toast-sonner";

interface RegenerateDialogProps {
  slug: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialPersonalization?: {
    timeValue: number;
    timeUnit: TimeUnit;
    durationValue: number;
    durationUnit: TimeUnit;
    skillLevel: SkillLevel;
  };
}

const RegenerateDialog = ({
  slug,
  open,
  onClose,
  initialPersonalization,
}: RegenerateDialogProps) => {
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [timeValue, setTimeValue] = useState<number>(1);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("hours");
  const [timeError, setTimeError] = useState<string | null>(null);

  const [durationValue, setDurationValue] = useState<number>(1);
  const [durationUnit, setDurationUnit] = useState<TimeUnit>("weeks");
  const [durationError, setDurationError] = useState<string | null>(null);

  const [skillLevel, setSkillLevel] = useState<SkillLevel>("beginner");
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (initialPersonalization) {
      setTimeValue(initialPersonalization.timeValue);
      setTimeUnit(initialPersonalization.timeUnit);
      setDurationValue(initialPersonalization.durationValue);
      setDurationUnit(initialPersonalization.durationUnit);
      setSkillLevel(initialPersonalization.skillLevel);
    }
  }, [initialPersonalization]);

  // Predefined reason options
  const reasonOptions = [
    { text: "Roadmap is too confusing 😵", value: "Roadmap is too confusing" },
    { text: "Roadmap is too long 😩", value: "Roadmap is too long" },
    { text: "Not detailed enough 🔍", value: "Not detailed enough" },
    {
      text: "Not aligned with my goals 🎯",
      value: "Not aligned with my goals",
    },
  ];

  const getMaxTime = () => (timeUnit === "hours" ? 12 : 720);
  const getMaxDuration = () => {
    switch (durationUnit) {
      case "months":
        return 12;
      case "weeks":
        return 52;
      case "days":
        return 365;
      default:
        return 12;
    }
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 5) {
      setReasonError("Reason must be at least 5 characters long");
    } else {
      setReasonError(null);
    }
    setReason(e.target.value);
  };

  const handleTimeAvailabilityChange = (value: number) => {
    const max = getMaxTime();

    if (value === 0) {
      setTimeError("Time availability cannot be empty");
    } else if (value > max) {
      setTimeError(`Maximum for ${timeUnit} is ${max}`);
    } else {
      setTimeError(null);
    }

    setTimeValue(value);
  };

  const handleDurationChange = (value: number) => {
    const max = getMaxDuration();

    if (value === 0) {
      setDurationError("Learning duration cannot be empty");
    } else if (value > max) {
      setDurationError(`Maximum for ${durationUnit} is ${max}`);
    } else {
      setDurationError(null);
    }

    setDurationValue(value);
  };

  const handleReasonClick = (value: string) => {
    setReason(value);
  };

  const handleRegenerateRoadmap = async () => {
    if (timeError || durationError) {
      return;
    }

    setLoading(true);
    try {
      const data = {
        reason: reason,
        personalization_options: {
          daily_time_availability: {
            value: timeValue,
            unit: timeUnit,
          },
          total_duration: {
            value: durationValue,
            unit: durationUnit,
          },
          skill_level: skillLevel,
        },
      };

      const response = await regenerateRoadmap(slug, data);
      if (!response.success) {
        toast({
          type: "error",
          title: "Error",
          description: response.message || "Failed to regenerate roadmap.",
        });
        return;
      }

      const result = response.data;

      if (result && result.flagged) {
        toast({
          type: "error",
          title: "Error",
          description: result.reason,
        });
        return;
      }

      toast({
        type: "success",
        title: "Success",
        description: "Your roadmap has been regenerated successfully!",
      });
      router.push(`/roadmap/${result?.slug}`);
    } catch (error) {
      const err = handleCurionaError(error);
      setReasonError(
        ERROR_MESSAGES[err.code] || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const preventDecimalInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "." || e.key === ",") {
      e.preventDefault();
    }
  };

  const preventPasteDecimal = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text");
    if (/[.,]/.test(paste)) {
      e.preventDefault();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className='z-[100] fixed inset-0 bg-[#3C3C3C]/10 backdrop-blur-sm data-[state=open]:animate-fadeIn overflow-y-auto'>
          <Dialog.Content className='flex flex-col gap-4 fixed left-1/2 top-1/2 w-80 h-fit max-h-[600px] md:w-[700px] md:max-h-[700px] lg:w-[800px] lg:max-h-[900px] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white-500 border-2 border-blue-500 p-10 text-blue-900 shadow-lg outline-none data-[state=open]:animate-fadeIn transition-all'>
            <Dialog.Title className='text-mobile-heading-2 lg:text-heading-2'>
              Not happy with your roadmap?
            </Dialog.Title>

            <p className='text-mobile-body-1-regular lg:text-body-1-regular'>
              You can regenerate a new personalized roadmap. This will replace
              your current roadmap. Do you want to continue?
            </p>

            {/* Reason Input */}
            <input
              placeholder='Enter your reason for regenerating...'
              minLength={5}
              value={reason}
              onChange={handleReasonChange}
              className='text-mobile-body-1-regular lg:text-body-1-regular w-full px-3 py-3 md:py-4 border border-white-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500'
            />
            {reasonError && (
              <p className='text-red-500 text-mobile-body-1-regular lg:text-body-1-regular'>
                {reasonError}
              </p>
            )}

            {/* Quick Reason Options */}
            <div className='text-mobile-caption lg:text-body-2 grid grid-cols-2 md:grid-cols-3 gap-2'>
              {reasonOptions.map((option, index) => (
                <button
                  key={`${index}-regen-option`}
                  onClick={() => handleReasonClick(option.value)}
                  className='p-2 border border-gray-300 rounded-lg hover:bg-blue-50 transition-colors'
                >
                  {option.text}
                </button>
              ))}
            </div>

            <div className='dashedLine' />

            {/* Personalization Options */}
            <div className='flex flex-col gap-6'>
              <button
                onClick={() => setExpanded(!expanded)}
                className='flex justify-between items-center text-blue-500'
              >
                <h3 className='text-mobile-body-1-regular lg:text-body-1-regular'>
                  Configure Personalization Option
                </h3>
                {expanded ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='12'
                    height='12'
                    viewBox='0 0 24 24'
                    className='rotate-90'
                  >
                    <path
                      fill='var(--black-200)'
                      d='M12.727 3.687a1 1 0 1 0-1.454-1.374l-8.5 9a1 1 0 0 0 0 1.374l8.5 9.001a1 1 0 1 0 1.454-1.373L4.875 12z'
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='12'
                    height='12'
                    viewBox='0 0 24 24'
                    className='-rotate-90'
                  >
                    <path
                      fill='var(--black-200)'
                      d='M12.727 3.687a1 1 0 1 0-1.454-1.374l-8.5 9a1 1 0 0 0 0 1.374l8.5 9.001a1 1 0 1 0 1.454-1.373L4.875 12z'
                    />
                  </svg>
                )}
              </button>

              {expanded && (
                <div className='flex flex-col gap-6'>
                  {/* Time Availability */}
                  <div className='flex flex-col gap-4'>
                    <h4 className='text-mobile-body-1-regular lg:text-body-1-regular'>
                      Time availability ⏳
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-3 h-40 md:h-14 gap-4 text-mobile-body-2 lg:text-body-2'>
                      <input
                        type='number'
                        min='1'
                        step={1}
                        inputMode='numeric'
                        value={timeValue}
                        onKeyDown={preventDecimalInput}
                        onPaste={preventPasteDecimal}
                        onChange={(e) =>
                          handleTimeAvailabilityChange(Number(e.target.value))
                        }
                        className='border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-center'
                      />
                      <select
                        value={timeUnit}
                        onChange={(e) =>
                          setTimeUnit(e.target.value as TimeUnit)
                        }
                        className='border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-center'
                      >
                        <option value='hours'>Hour</option>
                        <option value='minutes'>Minutes</option>
                      </select>
                      <div className='text-mobile-body-2 lg:text-body-2 flex items-center justify-center dashedBorder_2 bg-white-400 text-white-800 rounded-lg px-4'>
                        Per day
                      </div>
                    </div>

                    {timeError && (
                      <p className='text-red-500 text-mobile-body-1-regular lg:text-body-1-regular'>
                        {timeError}
                      </p>
                    )}
                  </div>

                  {/* Skill Level */}
                  <div className='flex flex-col gap-4'>
                    <h4 className='text-mobile-body-1-regular lg:text-body-1-regular'>
                      Familiarity 🧠
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-3 h-fit md:h-14 gap-4 text-mobile-body-2 lg:text-body-2'>
                      <Button
                        onClick={() => setSkillLevel("beginner")}
                        className={`p-4 border ${
                          skillLevel === "beginner"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        } rounded-lg transition-colors`}
                      >
                        {`😌 I'm new to this topic.`}
                      </Button>
                      <Button
                        onClick={() => setSkillLevel("intermediate")}
                        className={`p-4 border ${
                          skillLevel === "intermediate"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        } rounded-lg transition-colors`}
                      >
                        🙂 I know the basics.
                      </Button>
                      <Button
                        onClick={() => setSkillLevel("advanced")}
                        className={`p-4 border ${
                          skillLevel === "advanced"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        } rounded-lg transition-colors`}
                      >
                        {`😎 I'm confident and want deeper insights.`}
                      </Button>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className='flex flex-col gap-4'>
                    <h4 className='text-mobile-body-1-regular lg:text-body-1-regular'>
                      Learning Duration 📅
                    </h4>
                    <div className='text-mobile-body-2 lg:text-body-2 grid grid-cols-2 gap-4'>
                      <input
                        type='number'
                        min='1'
                        step={1}
                        value={durationValue}
                        onKeyDown={preventDecimalInput}
                        onPaste={preventPasteDecimal}
                        onChange={(e) =>
                          handleDurationChange(Number(e.target.value))
                        }
                        className='flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                      />
                      <select
                        value={durationUnit}
                        onChange={(e) =>
                          setDurationUnit(e.target.value as TimeUnit)
                        }
                        className='flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                      >
                        <option value='days'>Days</option>
                        <option value='weeks'>Week</option>
                        <option value='months'>Months</option>
                      </select>
                    </div>
                    {durationError && (
                      <p className='text-red-500 text-mobile-body-1-regular lg:text-body-1-regular'>
                        {durationError}
                      </p>
                    )}
                  </div>
                  <div className='dashedLine' />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className='text-mobile-body-1-medium lg:text-body-1-medium flex justify-between gap-2'>
              <Button
                className='p-3 text-black-100 border-2 border-white-600'
                onClick={onClose}
                aria-label='Close Chat'
                title='Close Chat'
              >
                Cancel
              </Button>

              <Button
                onClick={handleRegenerateRoadmap}
                disabled={
                  loading ||
                  !reason ||
                  timeError !== null ||
                  durationError !== null
                }
                className='p-3 bg-blue-500 md:min-w-64 text-white-500 hover:bg-blue-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? (
                  <RotatingLoader className='size-6 border-[3px] border-white-500' />
                ) : (
                  "Regenerate Roadmap ✨"
                )}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RegenerateDialog;
