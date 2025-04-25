"use client";

import React, { useState, useEffect } from "react";
import { RoadmapService } from "@/lib/services/roadmap.service";

const roadmapService = new RoadmapService();

export default function PersonalizeRoadmap() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    timeAvailability: 0,
    familiarity: "",
    duration: 0,
  });

  const handleNext = () => {
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
      !formData.duration
    ) {
      alert("Please complete all fields before submitting.");
      return;
    }

    const payload = {
      topic: "Thesis Mobile Application Front-End Development Using Next.js",
      personalization_options: {
        daily_time_availability: {
          value: Number(formData.timeAvailability),
          unit: "hours",
        },
        total_duration: {
          value: Number(formData.duration),
          unit: "months",
        },
        skill_level: formData.familiarity || "beginner",
      },
    };

    try {
      const response = await roadmapService.generateRoadmap(payload);

      if (!response.success) {
        throw new Error("Failed to submit data");
      }

      const result = response.data;
      console.log("Success:", result);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    console.log("Updated formData: ", formData);
  }, [formData]);

  return (
    <div className="justify-center px-6 lg:px-40 py-40">
      <div className="flex flex-wrap gap-4 items-center text-mobile-display-1 md:text-display-1">
        <h1>Personalize Your</h1>
        <span className="text-blue-500 dashedBorder px-5 py-1">Roadmap</span>
      </div>
      <form
        onSubmit={handleSubmit}
        className=" p-6 bg-white shadow rounded-xl space-y-6"
      >
        {/* Step Indicator */}
        {/* <div className="text-center font-semibold text-gray-700">
          Step {step} of 3
        </div> */}

        {/* Step 1: Time Availability */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-blue-500 text-heading-3">
              Select your available time to create a learning plan that fits
              your schedule.
            </p>
            <div className="grid grid-cols-3 gap-5 h-24">
              <input
                type="number"
                value={formData.timeAvailability}
                onChange={
                  (e) =>
                    setFormData({
                      ...formData,
                      timeAvailability: +e.target.value || 0,
                    }) // Gunakan + untuk konversi string ke number
                }
                className="border border-black-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 text-center"
                placeholder="0"
              />
              <input
                type="text"
                value="Hour"
                disabled
                className="border border-gray-300 rounded-lg p-2 text-center bg-gray-100 text-gray-500"
              />
              <input
                type="text"
                value="Per Day"
                disabled
                className="border border-gray-300 rounded-lg p-2 text-center bg-gray-100 text-gray-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: Familiarity */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-blue-500 text-heading-3">
              How familiar are you with the topic?
            </p>
            <div className="flex gap-5 h-24">
              {["beginner", "intermediate", "advanced"].map((level) => (
                <button
                  type="button"
                  key={level}
                  className={`flex-1 rounded-lg border px-4 py-2 font-medium transition ${
                    formData.familiarity === level
                      ? "bg-blue-500 text-white-500 border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-transparent hover:ring hover:ring-blue-500"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, familiarity: level })
                  }
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Duration */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-blue-500 text-heading-3">
              Target Learning Duration
            </p>
            <div className="grid grid-cols-2 gap-5 h-24">
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseFloat(e.target.value) || 0,
                  })
                }
                className="border border-gray-300 rounded-lg p-2 text-center"
                placeholder="0"
              />
              <input
                type="text"
                value="Month"
                disabled
                className="border border-gray-300 rounded-lg p-2 text-center bg-gray-100 text-gray-500"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-5 justify-between pt-4 h-24">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="w-full rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 focus:scale-100 transition-transform duration-300 ease-out hover:scale-105"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="w-full rounded-lg bg-blue-500 text-white-500 hover:bg-blue-900 focus:scale-100 transition-transform duration-300 ease-out hover:scale-105"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="w-full rounded-lg bg-green-700 text-white-500 hover:bg-green-900 focus:scale-100 transition-transform duration-300 ease-out hover:scale-105"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
