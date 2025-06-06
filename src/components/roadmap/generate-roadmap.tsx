"use client";

import Button from "@/components/ui/button";
import useFocus from "@/hooks/use-focus";
import { ERROR_MESSAGES, handleCurionaError } from "@/lib/error";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { useAuth } from "@/providers/auth-provider";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import RotatingLoader from "../loader/rotating-loader";
import { ShineBorder } from "../magicui/shine-border";

const roadmapService = new RoadmapService();

export default function GenerateRoadmap() {
  const { session, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [inputTopic, setInputTopic] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [inputRef, setFocus] = useFocus<HTMLInputElement>();

  const recommendationPrompts = [
    { label: "Guide me to ...", value: "Guide me to " },
    { label: "I want to learn...", value: "I want to learn " },
    {
      label: "Help me build a roadmap for...",
      value: "Help me build a roadmap for ",
    },
    { label: "Outline steps to master...", value: "Outline steps to master " },
    {
      label: "Show me how to start learning...",
      value: "Show me how to start learning ",
    },
    {
      label: "Develop a plan to become proficient in...",
      value: "Develop a plan to become proficient in ",
    },
  ];

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session || !isLoggedIn) {
      redirect("/sign-in");
    }

    const prompt = inputTopic.trim();

    if (prompt.length < 5) {
      setError("Topic must be at least 5 characters long.");
      return;
    }

    if (!prompt) {
      setError("Please enter a topic to generate your roadmap.");
      return;
    }

    try {
      setIsLoading(true);
      const moderationResult = await roadmapService.promptModeration(prompt);

      if (moderationResult.data.flagged) {
        setError(moderationResult.data.reason);
      } else {
        router.push(`/personalization?topic=${encodeURIComponent(prompt)}`);
      }
    } catch (error) {
      const err = handleCurionaError(error);
      setError(ERROR_MESSAGES[err.code] || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='flex sm:justify-end sm:-mt-10'>
        <p className='text-gray-500 text-mobile-heading-4-regular lg:text-body-2-regular'>
          {inputTopic.length}/150
        </p>
      </div>
      <div className='relative'>
        <div className='flex-grow w-full h-16 md:h-20 text-mobile-heading-4-regular lg:text-heading-4-regular rounded-xl md:rounded-2xl bg-white-500 border border-gray-300 shadow shadow-blue-500'>
          <ShineBorder
            duration={14}
            borderWidth={2}
            shineColor={["#4b7ce8", "#5C469C"]}
          />
          <form onSubmit={handleGenerate} className='relative w-full h-full'>
            <input
              ref={inputRef}
              type='text'
              minLength={5}
              maxLength={150}
              placeholder='Enter a topic to generate your personalized roadmap...'
              className={`w-full h-full bg-transparent px-5 rounded-[var(--card-content-radius)] focus:outline-none ${
                error ? "border-red-500" : ""
              }`}
              style={{ paddingRight: "80px" }}
              value={inputTopic}
              onChange={(e) => {
                setInputTopic(e.target.value);
                if (error) setError("");
              }}
            />
            <Button
              // onClick={handleGenerate}
              className='absolute right-3 top-1/2 -translate-y-1/2 bg-blue-500 p-3 text-white hover:bg-blue-900'
            >
              {isLoading && (
                <RotatingLoader className='size-4 border-[3px] border-white-500' />
              )}
              {!isLoading && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 16 16'
                  fill='var(--white-500)'
                >
                  <path d='M5.398 10.807a1.04 1.04 0 0 0 1.204-.003c.178-.13.313-.31.387-.518l.447-1.373c.115-.344.308-.657.564-.914a2.35 2.35 0 0 1 .913-.565l1.391-.451a1.05 1.05 0 0 0 .645-.67a1.04 1.04 0 0 0-.689-1.31l-1.375-.447a2.34 2.34 0 0 1-1.48-1.477l-.452-1.388a1.043 1.043 0 0 0-1.717-.39a1.05 1.05 0 0 0-.256.407l-.457 1.4a2.32 2.32 0 0 1-1.44 1.449l-1.391.448a1.06 1.06 0 0 0-.644.67a1.05 1.05 0 0 0 .144.918c.128.18.309.315.517.386l1.374.445a2.33 2.33 0 0 1 1.481 1.488l.452 1.391c.072.204.206.38.382.504m6.137 4.042a.8.8 0 0 0 .926.002a.8.8 0 0 0 .3-.4l.248-.762a1.07 1.07 0 0 1 .68-.68l.772-.252a.79.79 0 0 0 .531-.64a.796.796 0 0 0-.554-.881l-.764-.249a1.08 1.08 0 0 1-.68-.678l-.252-.773a.8.8 0 0 0-.293-.39a.796.796 0 0 0-1.03.085a.8.8 0 0 0-.195.315l-.247.762a1.07 1.07 0 0 1-.665.679l-.773.252a.8.8 0 0 0-.543.762a.8.8 0 0 0 .551.756l.763.247c.159.054.304.143.422.261c.119.119.207.263.258.422l.253.774a.8.8 0 0 0 .292.388' />
                </svg>
              )}
            </Button>
          </form>
        </div>
      </div>

      {error && <p className='text-red-500 text-sm'>{error}</p>}
      <div className='flex flex-wrap gap-2 justify-start'>
        {recommendationPrompts.map((prompt, idx) => (
          <Button
            key={`${idx}-recommendation`}
            onClick={() => {
              if (error) setError("");
              setInputTopic(prompt.value);
              setFocus();
            }}
            className='flex-grow p-2 text-black-300 border-2 border-black-100 bg-white-500 rounded-2xl hover:bg-white-600 transition-colors duration-200'
          >
            {prompt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
