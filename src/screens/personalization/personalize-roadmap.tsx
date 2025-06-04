"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { Progress } from "radix-ui";
import Button from "@/components/ui/button";
import Loader from "@/components/loader/loader";

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
  const [isLoading, setIsLoading] = useState(false);

  // Error messages
  const [timeError, setTimeError] = useState<string | null>(null);
  const [durationError, setDurationError] = useState<string | null>(null);

  const [step1Error, setStep1Error] = useState<string | null>(null);
  const [step3Error, setStep3Error] = useState<string | null>(null);

  // Fungsi max time berdasarkan unit
  const getMaxTime = () => (formData.timeUnit === "hours" ? 12 : 720);
  const minValue = 0;

  // Fungsi max duration berdasarkan unit
  const getMaxDuration = () => {
    switch (formData.durationUnit) {
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

  const handleTimeAvailabilityChange = (value: string) => {
    const num = value === "" ? 0 : +value;
    const max = getMaxTime();

    if (value === "") {
      setTimeError("Time availability cannot be empty");
      setStep1Error("Please input your daily time availability.");
    } else {
      if (num > max) {
        setTimeError(`Maximum for ${formData.timeUnit} is ${max}`);
        setStep1Error(`Maximum for ${formData.timeUnit} is ${max}`);
      } else {
        setTimeError(null);
        setStep1Error(null);
      }
    }

    setFormData({ ...formData, timeAvailability: num });
  };

  const handleDurationChange = (value: number | "") => {
    const max = getMaxDuration();

    if (value === "") {
      setDurationError("Learning duration cannot be empty");
      setStep3Error("Please input your learning duration.");
      setFormData({ ...formData, duration: 0 });
      return;
    }

    if (typeof value === "number" && value > max) {
      setDurationError(`Maximum for ${formData.durationUnit} is ${max}`);
      setStep3Error(`Maximum for ${formData.durationUnit} is ${max}`);
    } else {
      setDurationError(null);
      setStep3Error(null);
    }

    setFormData({ ...formData, duration: value });
  };

  const handleNext = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (step === 1) {
      // Validasi jika kosong
      if (!formData.timeAvailability || formData.timeAvailability === 0) {
        setStep1Error("Please input your daily time availability.");
        return;
      }
      // Validasi error maksimum
      if (timeError) return;
      setStep(step + 1);
    } else if (step === 2) {
      if (!formData.familiarity) {
        alert("Please select your familiarity level.");
        return;
      }
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validasi input durasi kosong
    if (!formData.duration || formData.duration === 0) {
      setStep3Error("Please input your learning duration.");
      setIsLoading(false);
      return;
    }

    // Validasi error durasi
    if (durationError || step3Error) {
      setIsLoading(false);
      return;
    }

    // Pastikan semua field lengkap
    if (
      !formData.timeAvailability ||
      !formData.familiarity ||
      !formData.duration ||
      !topic
    ) {
      alert("Please complete all fields including topic before submitting.");
      setIsLoading(false);
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
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   console.log("Updated formData: ", formData);
  // }, [formData]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[999] bg-white-500 flex items-center justify-center">
          <Loader />
        </div>
      )}
      <div className="w-full bg-white rounded-xl shadow-xl px-4 py-8 space-y-10">
        {/* Header */}
        <div className="text-mobile-heading-1-bold lg:text-heading-1-bold flex flex-wrap items-center gap-2">
          <h1>
            Personalize Your
          </h1>
          {step === 1 && (
            <span className="text-blue-500 dashedBorder px-2 md:px-4 py-2">
              ⏳ Time Availability
            </span>
          )}
          {step === 2 && (
            <span className="text-blue-500 dashedBorder px-6 py-2">
              🤯 Familiarity
            </span>
          )}
          {step === 3 && (
            <span className="text-blue-500 dashedBorder px-6 py-2">
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
              <p className="text-mobile-heading-4-regular lg:text-heading-4-regular">
                How much time can you learn each day or week? We'll fit the plan
                to your schedule 😌
              </p>
              {step1Error && (
                <p className="text-red-500 text-mobile-body-1-regular lg:text-body-1-regular">
                  {step1Error}
                </p>
              )}
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  value={
                    formData.timeAvailability === 0
                      ? ""
                      : formData.timeAvailability
                  }
                  onChange={(e) => handleTimeAvailabilityChange(e.target.value)}
                  className={`text-mobile-body-1-medium lg:text-body-1-medium dashedBorder_2 rounded-lg px-4 py-3 text-center focus:outline-none focus:ring-2 focus:bg-none ${
                    step1Error ? "ring-red-500" : "ring-blue-500"
                  }`}
                  placeholder="0"
                />
                {/* Select Unit */}
                <select
                  value={formData.timeUnit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      timeUnit: e.target.value as "hours" | "minutes",
                    })
                  }
                  className="text-mobile-body-1-medium lg:text-body-1-medium flex items-center justify-center dashedBorder_2 rounded-lg px-4 py-3 text-center focus:outline-blue-500 focus:bg-none focus:outline-none focus:ring focus:ring-blue-500"
                >
                  <option value="hours">Hour(s)</option>
                  <option value="minutes">Minute(s)</option>
                </select>
                <div className="text-mobile-body-1-medium lg:text-body-1-medium flex items-center justify-center dashedBorder_2 bg-white-400 text-white-800 rounded-lg px-4 py-3">
                  Per day
                </div>
              </div>
            </div>
          )}
          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <p className="text-mobile-heading-4-regular lg:text-heading-4-regular">
                Tell us how well you know the topic—so we can match the content
                to your skill level 😉
              </p>
              <div className="text-mobile-body-1-medium lg:text-body-1-medium grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Button
                    type="button"
                    key={label}
                    className={`border p-4 text-sm flex items-center justify-center text-center ${
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
                  </Button>
                ))}
              </div>
            </div>
          )}
          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <p className="text-mobile-heading-4-regular lg:text-heading-4-regular">
                Set how long you want your learning journey to take—short and
                focused or paced and steady 🧘
              </p>
              {step3Error && (
                <p className="text-red-500 text-mobile-body-1-regular lg:text-body-1-regular">
                  {step3Error}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4">
                {/* Input duration */}
                <input
                  type="number"
                  min={1}
                  value={formData.duration === 0 ? "" : formData.duration}
                  onChange={(e) =>
                    handleDurationChange(
                      e.target.value === "" ? "" : +e.target.value
                    )
                  }
                  className={`text-mobile-body-1-medium lg:text-body-1-medium dashedBorder_2 rounded-lg px-4 py-3 text-center focus:outline-none focus:ring-2 focus:bg-none ${
                    step3Error ? "ring-red-500" : "ring-blue-500"
                  }`}
                  placeholder="0"
                />

                {/* Select duration unit */}
                <select
                  value={formData.durationUnit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      durationUnit: e.target.value as
                        | "months"
                        | "weeks"
                        | "days",
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
              <div className="col-span-12 w-full text-mobile-body-1-bold">
                <Button
                  type="button"
                  onClick={handleNext}
                  className="lg:text-body-1-bold w-full bg-blue-500 text-white-500 py-3 active:bg-blue-900"
                >
                  Next
                </Button>
              </div>
            ) : (
              <>
                <div className="text-mobile-body-1-bold">
                  <Button
                    type="button"
                    onClick={handleBack}
                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-100 py-3"
                  >
                    Back
                  </Button>
                </div>
                {step < 3 ? (
                  <div className="text-mobile-body-1-bold">
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="w-full bg-blue-500 text-white-500 py-3 active:bg-blue-900"
                    >
                      Next
                    </Button>
                  </div>
                ) : (
                  <div className="text-mobile-body-1-bold">
                    <Button
                      type="submit"
                      className="w-full px-2 py-3 bg-blue-500 text-white-500 active:bg-blue-900"
                    >
                      Generate My Learning Plan
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
