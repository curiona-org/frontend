"use client";
import { Dialog } from "radix-ui";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RoadmapService } from "@/lib/services/roadmap.service";
import Loader from "@/components/loader/loader";

const roadmapService = new RoadmapService();

interface RegenerateDialogProps {
  slug: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialPersonalization?: {
    timeValue: number;
    timeUnit: TimeUnit;
    durationValue: number;
    durationUnit: DurationUnit;
    skillLevel: SkillLevel;
  };
}

type TimeUnit = "hours" | "minutes";
type DurationUnit = "months" | "weeks" | "days";
type SkillLevel = "beginner" | "intermediate" | "advanced";

const RegenerateDialog = ({
  slug,
  open,
  onClose,
  onSuccess,
  initialPersonalization,
}: RegenerateDialogProps) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeValue, setTimeValue] = useState<number>(1);
  const [durationValue, setDurationValue] = useState<number>(1);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("hours");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("weeks");
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

  const handleReasonClick = (value: string) => {
    setReason(value);
  };

  const handleRegenerateRoadmap = async () => {
    if (!reason) {
      alert("Please provide a reason for regenerating the roadmap");
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

      const response = await roadmapService.regenerateRoadmap(slug, data);
      if (!response.success) {
        throw new Error("Failed to regenerate roadmap");
      }

      const result = response.data;
      router.push(`/roadmap/${result.slug}`);
    } catch (error) {
      console.error("Failed to regenerate roadmap:", error);
      alert("Failed to regenerate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="z-[100] fixed inset-0 bg-[#3C3C3C]/10 backdrop-blur-sm data-[state=open]:animate-fadeIn overflow-y-auto">
          <Dialog.Content className="flex flex-col gap-4 fixed left-1/2 top-1/2 w-[800px] max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white-500 border-2 border-blue-500 p-10 text-blue-900 shadow-lg outline-none data-[state=open]:animate-fadeIn transition-all">
            <Dialog.Title className="text-mobile-heading-2 lg:text-heading-2">
              Not happy with your roadmap?
            </Dialog.Title>

            <p className="text-mobile-body-1-regular lg:text-body-1-regular">
              You can regenerate a new personalized roadmap. This will replace
              your current roadmap. Do you want to continue?
            </p>

            {/* Reason Input */}
            <input
              placeholder="Type Here"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-4 border border-white-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500"
            />

            {/* Quick Reason Options */}
            <div className="flex flex-wrap gap-2">
              {reasonOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleReasonClick(option.value)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  {option.text}
                </button>
              ))}
            </div>

            <div className="dashedLine" />

            {/* Personalization Options */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex justify-between items-center"
            >
              <h3 className="text-mobile-body-1-regular lg:text-body-1-regular">
                Personalization Option
              </h3>
              {expanded ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  className="rotate-90"
                >
                  <path
                    fill="var(--black-200)"
                    d="M12.727 3.687a1 1 0 1 0-1.454-1.374l-8.5 9a1 1 0 0 0 0 1.374l8.5 9.001a1 1 0 1 0 1.454-1.373L4.875 12z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  className="-rotate-90"
                >
                  <path
                    fill="var(--black-200)"
                    d="M12.727 3.687a1 1 0 1 0-1.454-1.374l-8.5 9a1 1 0 0 0 0 1.374l8.5 9.001a1 1 0 1 0 1.454-1.373L4.875 12z"
                  />
                </svg>
              )}
            </button>

            {expanded && (
              <div className="space-y-6">
                {/* Time Availability */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-mobile-body-1-regular lg:text-body-1-regular">
                    Personalize Your Time availability ⏳
                  </h4>
                  <div className="grid grid-cols-12 gap-4 text-mobile-body-2 lg:text-body-2">
                    <input
                      type="number"
                      min="1"
                      value={timeValue}
                      onChange={(e) => setTimeValue(Number(e.target.value))}
                      className="col-span-4 w-full flex-1 h-16 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-center"
                    />
                    <select
                      value={timeUnit}
                      onChange={(e) => setTimeUnit(e.target.value as TimeUnit)}
                      className="col-span-4 flex-1 w-full h-16 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-center"
                    >
                      <option value="hours">Hour</option>
                      <option value="minutes">Minutes</option>
                    </select>
                    <div className="col-span-4 w-full text-mobile-body-1-medium lg:text-body-1-medium flex items-center justify-center dashedBorder_2 bg-white-400 text-white-800 rounded-lg px-4 py-3">
                      Per day
                    </div>
                  </div>
                </div>

                {/* Skill Level */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-mobile-body-1-regular lg:text-body-1-regular">
                    Personalize Your Familiarity 🧠
                  </h4>
                  <div className="grid grid-cols-12 gap-4">
                    <button
                      onClick={() => setSkillLevel("beginner")}
                      className={`col-span-4 w-full p-4 border ${
                        skillLevel === "beginner"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      } rounded-lg transition-colors`}
                    >
                      😌 I'm new to this topic.
                    </button>
                    <button
                      onClick={() => setSkillLevel("intermediate")}
                      className={`col-span-4 w-full p-4 border ${
                        skillLevel === "intermediate"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      } rounded-lg transition-colors`}
                    >
                      🙂 I know the basics.
                    </button>
                    <button
                      onClick={() => setSkillLevel("advanced")}
                      className={`col-span-4 w-full p-4 border ${
                        skillLevel === "advanced"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      } rounded-lg transition-colors`}
                    >
                      😎 I'm confident and want deeper insights.
                    </button>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-mobile-body-1-regular lg:text-body-1-regular">
                    Personalize Your Learning Duration 📅
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      min="1"
                      value={durationValue}
                      onChange={(e) => setDurationValue(Number(e.target.value))}
                      className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <select
                      value={durationUnit}
                      onChange={(e) =>
                        setDurationUnit(e.target.value as DurationUnit)
                      }
                      className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Week</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between">
              <button
                className="p-3 bg-blue-50 rounded-lg text-blue-400 hover:text-blue-600"
                onClick={onClose}
                aria-label="Close Chat"
                title="Close Chat"
              >
                Cancel
              </button>

              <button
                onClick={handleRegenerateRoadmap}
                disabled={loading || !reason}
                className="p-3 bg-blue-500 text-white-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Regenerate Roadmap✨
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RegenerateDialog;
