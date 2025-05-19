"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { Progress } from "radix-ui";

const roadmapService = new RoadmapService();

interface PersonalizeRoadmapProps {
  topic: string;
}

export default function PersonalizeRoadmap({ topic }: PersonalizeRoadmapProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    timeAvailability: 0,
    timeUnit: "hours" as "hours" | "minutes",
    familiarity: "",
    duration: 0,
    durationUnit: "months" as "months" | "weeks" | "days",
  });
  const router = useRouter();

  const handleNext = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step === 1 && !formData.timeAvailability) {
      alert("Please input your daily time availability.");
      return;
    }

    if (step === 2 && !formData.familiarity) {
      alert("Please select your familiarity level.");
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.timeAvailability ||
      !formData.familiarity ||
      !formData.duration ||
      !topic
    ) {
      alert("Please complete all fields including topic before submitting.");
      return;
    }

    const payload = {
      topic: topic,
      personalization_options: {
        daily_time_availability: {
          value: Number(formData.timeAvailability),
          unit: formData.timeUnit,
        },
        total_duration: {
          value: Number(formData.duration),
          unit: formData.durationUnit,
        },
        skill_level: formData.familiarity,
      },
    };

    console.log("Topic: ", topic);

    try {
      const response = await roadmapService.generateRoadmap(payload);

      if (!response.success) {
        throw new Error("Failed to submit data");
      }

      const result = response.data;
      console.log("Success:", result);
      if (result?.slug) {
        router.push(`/roadmap/${result.slug}`);
      } else {
        alert("Roadmap generated, but no slug was returned.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    console.log("Updated formData: ", formData);
  }, [formData]);

  return (
    <div className="w-full bg-white rounded-xl shadow-xl px-4 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-display-1 font-bold text-left">Personalize Your</h1>
        {step === 1 && (
          <span className="text-blue-500 dashedBorder px-6 py-2 text-display-1 font-semibold">
            ⏳ Time availability
          </span>
        )}
        {step === 2 && (
          <span className="text-blue-500 dashedBorder px-6 py-2 text-display-1 font-semibold">
            🤯 Familiarity
          </span>
        )}
        {step === 3 && (
          <span className="text-blue-500 dashedBorder px-6 py-2 text-display-1 font-semibold">
            📅 Learning Duration
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <Progress.Root
        className="w-full h-[5px] bg-gray-200 rounded-full overflow-hidden"
        value={step}
        max={3}
      >
        <Progress.Indicator
          className="bg-blue-500 h-full transition-all duration-500"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </Progress.Root>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-10 text-left">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <p className="text-heading-4">
              How much time can you learn each day or week? We’ll fit the plan
              to your schedule 😌
            </p>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                value={
                  formData.timeAvailability === 0
                    ? ""
                    : formData.timeAvailability
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeAvailability:
                      e.target.value === "" ? 0 : +e.target.value,
                  })
                }
                className="dashedBorder_2 rounded-lg px-4 py-3 text-center focus:outline-blue-500 focus:bg-none focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="0"
              />
              <select
                value={formData.timeUnit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeUnit: e.target.value as "hours" | "minutes",
                  })
                }
                className="flex items-center justify-center dashedBorder_2 rounded-lg px-4 py-3 text-center focus:outline-blue-500 focus:bg-none focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="hours">Hour(s)</option>
                <option value="minutes">Minute(s)</option>
              </select>
              {/* <div className=""></div> */}
              <div className="flex items-center justify-center dashedBorder_2 bg-white-400 text-white-800 text-mobile-body-1-medium lg:text-body-1-medium rounded-lg px-4 py-3">
                Per day
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <p className="text-heading-4">
              Tell us how well you know the topic—so we can match the content to
              your skill level 😉
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "beginner",
                  emoji: "🥱",
                  text: "I'm new to this topic.",
                },
                {
                  label: "intermediate",
                  emoji: "🤓",
                  text: "I know the basics.",
                },
                {
                  label: "advanced",
                  emoji: "😎",
                  text: "I'm confident and want deeper insights.",
                },
              ].map(({ label, emoji, text }) => (
                <button
                  type="button"
                  key={label}
                  className={`rounded-lg border p-4 text-sm transition-all flex items-center justify-center text-center ${
                    formData.familiarity === label
                      ? "bg-blue-500 text-white-500 border-blue-500"
                      : "bg-white text-gray-800 border-gray-300 hover:border-blue-400 hover:ring"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, familiarity: label })
                  }
                >
                  <span className="text-lg mr-2">{emoji}</span>
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <p className="text-heading-4">
              Set how long you want your learning journey to take—short and
              focused or paced and steady 🧘
            </p>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={formData.duration === 0 ? "" : formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: e.target.value === "" ? 0 : +e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-3 text-center focus:ring focus:ring-blue-500 w-full"
                placeholder="1"
              />
              <select
                value={formData.durationUnit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationUnit: e.target.value as "months" | "weeks" | "days",
                  })
                }
                className="dashedBorder_2 rounded-lg px-4 py-3 text-center focus:outline-blue-500 focus:bg-none focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="weeks">Week(s)</option>
                <option value="days">Day(s)</option>
                <option value="months">Month(s)</option>
              </select>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          {step === 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="col-span-2 w-full bg-blue-500 text-white-500 rounded-lg py-3 hover:bg-blue-700 transition"
            >
              Next
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleBack}
                className="w-full rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 py-3"
              >
                Back
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-blue-500 text-white-500 rounded-lg py-3 hover:bg-blue-700 transition"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white rounded-lg py-3 hover:bg-green-800 transition"
                >
                  Generate My Learning Plan
                </button>
              )}
            </>
          )}
        </div>
      </form>
    </div>
  );
}
