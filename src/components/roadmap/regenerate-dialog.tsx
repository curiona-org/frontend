"use client";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { GetTopicBySlugOutput } from "@/types/api-topic";
import Loader from "@/components/loader/loader";

const roadmapService = new RoadmapService();

interface RegenerateDialogProps {
  slug: string;
  open: boolean;
  onClose: () => void;
  personalization: {
    timeAvailability: {
      amount: number;
      unit: string;
    };
    familiarity: string;
    learningDuration: {
      amount: number;
      unit: string;
    };
  };
}

const RegenerateDialog = ({
  slug,
  open,
  onClose,
  personalization,
}: RegenerateDialogProps) => {
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPersonalization, setShowPersonalization] =
    useState<boolean>(false);

  // Personalization state
  const [timeAmount, setTimeAmount] = useState<number>(
    personalization.timeAvailability.amount
  );
  const [timeUnit, setTimeUnit] = useState<string>(
    personalization.timeAvailability.unit
  );
  const [familiarity, setFamiliarity] = useState<string>(
    personalization.familiarity
  );
  const [durationAmount, setDurationAmount] = useState<number>(
    personalization.learningDuration.amount
  );
  const [durationUnit, setDurationUnit] = useState<string>(
    personalization.learningDuration.unit
  );

  const handleRegenerate = async () => {
    if (!slug) return;

    setLoading(true);
    try {
      await roadmapService.regenerateRoadmap(slug);
      onClose();
      window.location.reload(); // Reload to show the new roadmap
    } catch (error) {
      console.error("Error regenerating roadmap:", error);
    } finally {
      setLoading(false);
    }
  };

  const suggestionOptions = [
    { text: "Roadmap is too confusing 😵", value: "Roadmap is too confusing" },
    { text: "Roadmap is too long 😩", value: "Roadmap is too long" },
    { text: "Not detailed enough 🔍", value: "Not detailed enough" },
    {
      text: "Not aligned with my goals 🎯",
      value: "Not aligned with my goals",
    },
  ];

  const selectSuggestion = (suggestion: string) => {
    setReason(suggestion);
  };

  const familiarityOptions = [
    { text: "😊 I'm new to this topic.", value: "beginner" },
    { text: "😌 I know the basics.", value: "intermediate" },
    { text: "😎 I'm confident and want deeper insights.", value: "advanced" },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="z-[100] fixed inset-0 bg-[#3C3C3C]/10 backdrop-blur-sm data-[state=open]:animate-fadeIn overflow-y-auto">
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[800px] max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white-500 border-2 border-blue-500 p-10 text-blue-900 shadow-lg outline-none data-[state=open]:animate-fadeIn transition-all">
            <Dialog.Title className="text-4xl font-bold text-center mb-4">
              Not happy with your roadmap?
            </Dialog.Title>

            <p className="text-center text-lg mb-8">
              You can regenerate a new personalized roadmap. This will replace
              your current roadmap. Do you want to continue?
            </p>

            {/* Reason input */}
            <div className="mb-4">
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Type Here"
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>

            {/* Suggestion buttons */}
            <div className="flex flex-wrap gap-2 mb-8">
              {suggestionOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(option.value)}
                  className="px-4 py-2 border rounded-lg hover:bg-blue-50 transition"
                >
                  {option.text}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6 relative">
              <div className="absolute left-0 right-0 -top-0.5 flex justify-center">
                <div className="bg-white px-4 -mt-3 flex items-center gap-2">
                  <span className="text-xl text-gray-400">
                    Personalization Option
                  </span>
                  <button
                    onClick={() => setShowPersonalization(!showPersonalization)}
                    className="text-gray-400"
                  >
                    {showPersonalization ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Personalization options */}
            {showPersonalization && (
              <div className="mt-8 space-y-8">
                {/* Time availability */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Personalize Your Time availability ⏳
                  </h3>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={timeAmount}
                      onChange={(e) => setTimeAmount(Number(e.target.value))}
                      className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="w-full p-4 border rounded-lg bg-gray-50 text-center">
                      Hour
                    </div>
                    <div className="w-full p-4 border rounded-lg bg-gray-50 text-center">
                      Per day
                    </div>
                  </div>
                </div>

                {/* Familiarity */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Personalize Your Familiarity 🧠
                  </h3>
                  <div className="flex gap-4">
                    {familiarityOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setFamiliarity(option.value)}
                        className={`w-full p-4 border rounded-lg text-center transition ${
                          familiarity === option.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Learning Duration */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Personalize Your Learning Duration 📅
                  </h3>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={durationAmount}
                      onChange={(e) =>
                        setDurationAmount(Number(e.target.value))
                      }
                      className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={durationUnit}
                      onChange={(e) => setDurationUnit(e.target.value)}
                      className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={onClose}
                className="px-8 py-4 border rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
              >
                {loading ? <Loader size="sm" /> : <>Regenerate Roadmap✨</>}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RegenerateDialog;
