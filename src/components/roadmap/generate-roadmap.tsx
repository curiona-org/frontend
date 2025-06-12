"use client";
import { promptModeration } from "@/app/roadmap/[slug]/actions";
import Button from "@/components/ui/button";
import useFocus from "@/hooks/use-focus";
import { ERROR_MESSAGES, handleCurionaError } from "@/lib/error";
import { useAuth } from "@/providers/auth-provider";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import RotatingLoader from "../loader/rotating-loader";
import { ShineBorder } from "../magicui/shine-border";

export default function GenerateRoadmap() {
  const { session, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [inputTopic, setInputTopic] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [textareaRef, setFocus] = useFocus<HTMLTextAreaElement>();
  const [shouldFocusEnd, setShouldFocusEnd] = useState(false);

  const recommendationPrompts = [
    { label: "I want to learn...", value: "I want to learn " },
    {
      label: "Show me how to start learning...",
      value: "Show me how to start learning ",
    },
    { label: "Outline steps to master...", value: "Outline steps to master " },
    { label: "Guide me to ...", value: "Guide me to " },
    {
      label: "Help me build a roadmap for...",
      value: "Help me build a roadmap for ",
    },
    {
      label: "Develop a plan to achieve...",
      value: "Develop a plan to achieve ",
    },
  ];

  const adjustTextareaHeight = () => {
    const ta = textareaRef?.current;
    if (!ta) return;

    // Reset height dulu
    ta.style.height = "auto";

    // Get the scrollHeight
    const scrollH = ta.scrollHeight;

    // Get line count (approximation)
    const lineHeight = parseInt(window.getComputedStyle(ta).lineHeight);
    const paddingTop = parseInt(window.getComputedStyle(ta).paddingTop);
    const paddingBottom = parseInt(window.getComputedStyle(ta).paddingBottom);
    const totalPadding = paddingTop + paddingBottom;

    // Approximate number of lines
    const textLines = Math.max(
      1,
      Math.floor((scrollH - totalPadding) / lineHeight)
    );

    // Set the height based on content
    ta.style.height = `${scrollH}px`;

    // Center text vertically if single line
    if (textLines <= 1) {
      // For single line, center text vertically
      ta.style.paddingTop = "1.25rem"; // Adjust this value as needed
      ta.style.paddingBottom = "1.25rem"; // Adjust this value as needed
    } else {
      // For multiple lines, use standard padding
      ta.style.paddingTop = "0.75rem";
      ta.style.paddingBottom = "0.75rem";
    }
  };

  // Use useLayoutEffect for DOM measurements to avoid flicker
  useLayoutEffect(() => {
    adjustTextareaHeight();
  }, [inputTopic]);

  useEffect(() => {
    // Handle focus and caret positioning
    if (shouldFocusEnd) {
      setFocus();
      const ta = textareaRef?.current;
      if (ta) {
        const len = ta.value.length;
        ta.setSelectionRange(len, len);
      }
      setShouldFocusEnd(false);
    }
  }, [shouldFocusEnd, setFocus, textareaRef]);

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
      const moderationResult = await promptModeration(prompt);
      if (!moderationResult.success || !moderationResult.data) {
        setError(moderationResult.message || "Failed to moderate prompt.");
        return;
      }

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
    <div className="flex flex-col gap-4">
      <div className="flex sm:justify-end sm:-mt-10">
        <p className="text-gray-500 text-mobile-heading-4-regular lg:text-body-2-regular">
          {inputTopic.length}/150
        </p>
      </div>
      <div className="relative">
        <div className="flex-grow w-full text-mobile-heading-4-regular lg:text-heading-4-regular rounded-xl md:rounded-2xl bg-white-500 border border-gray-300 shadow shadow-blue-500">
          <ShineBorder
            duration={14}
            borderWidth={2}
            shineColor={["#4b7ce8", "#5C469C"]}
          />
          <form onSubmit={handleGenerate} className="relative w-full">
            <textarea
              ref={textareaRef}
              rows={1}
              maxLength={150}
              placeholder="Enter a topic to generate your personalized roadmap..."
              className={`w-full text-mobile-heading-4-regular lg:text-heading-4-regular bg-transparent px-5 rounded-[var(--card-content-radius)] focus:outline-none resize-none ${
                error ? "border-red-500" : ""
              } flex items-center`}
              style={{
                lineHeight: "1.5",
                minHeight: "4rem",
                paddingLeft: "1.25rem",
                paddingRight: "5rem",
                paddingTop: "1.25rem",
                paddingBottom: "1.25rem",
                overflow: "auto",
                display: "flex",
                alignItems: "center",
              }}
              value={inputTopic}
              onChange={(e) => {
                setInputTopic(e.target.value);
                if (error) setError("");
              }}
              onInput={adjustTextareaHeight}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const formEvent = {
                    preventDefault: () => {},
                  } as React.FormEvent<HTMLFormElement>;
                  handleGenerate(formEvent);
                }
              }}
            />
            <Button className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-500 p-3 text-white hover:bg-blue-900">
              {isLoading && (
                <RotatingLoader className="size-4 border-[3px] border-white-500" />
              )}
              {!isLoading && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="var(--white-500)"
                >
                  <path d="M5.398 10.807a1.04 1.04 0 0 0 1.204-.003c.178-.13.313-.31.387-.518l.447-1.373c.115-.344.308-.657.564-.914a2.35 2.35 0 0 1 .913-.565l1.391-.451a1.05 1.05 0 0 0 .645-.67a1.04 1.04 0 0 0-.689-1.31l-1.375-.447a2.34 2.34 0 0 1-1.48-1.477l-.452-1.388a1.043 1.043 0 0 0-1.717-.39a1.05 1.05 0 0 0-.256.407l-.457 1.4a2.32 2.32 0 0 1-1.44 1.449l-1.391.448a1.06 1.06 0 0 0-.644.67a1.05 1.05 0 0 0 .144.918c.128.18.309.315.517.386l1.374.445a2.33 2.33 0 0 1 1.481 1.488l.452 1.391c.072.204.206.38.382.504m6.137 4.042a.8.8 0 0 0 .926.002a.8.8 0 0 0 .3-.4l.248-.762a1.07 1.07 0 0 1 .68-.68l.772-.252a.79.79 0 0 0 .531-.64a.796.796 0 0 0-.554-.881l-.764-.249a1.08 1.08 0 0 1-.68-.678l-.252-.773a.8.8 0 0 0-.293-.39a.796.796 0 0 0-1.03.085a.8.8 0 0 0-.195.315l-.247.762a1.07 1.07 0 0 1-.665.679l-.773.252a.8.8 0 0 0-.543.762a.8.8 0 0 0 .551.756l.763.247c.159.054.304.143.422.261c.119.119.207.263.258.422l.253.774a.8.8 0 0 0 .292.388" />
                </svg>
              )}
            </Button>
          </form>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Prompt recommendations for desktop view */}
      <div className="hidden sm:flex flex-row flex-wrap gap-2 justify-start">
        {recommendationPrompts.map((prompt, idx) => (
          <Button
            key={idx}
            onClick={() => {
              if (error) setError("");
              setInputTopic(prompt.value);
              setShouldFocusEnd(true);
            }}
            className="inline-flex flex-grow justify-center items-center p-2 gap-2 text-black-300 border-2 border-black-100 bg-white-500 !rounded-full hover:bg-white-600 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5 stroke-black-100"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M9 12h6" />
              <path d="M12 9v6" />
            </svg>{" "}
            <span className="text-body-2 sm:text-body-1-regular">
              {prompt.label}
            </span>
          </Button>
        ))}
      </div>

      {/* Prompt recommendations for mobile view */}
      <div className="sm:hidden w-full overflow-hidden">
        <div className="w-full relative">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white-500 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white-500 to-transparent z-10 pointer-events-none"></div>
          <div className="flex flex-row gap-2 px-4 justify-start w-full overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {recommendationPrompts.map((prompt, idx) => (
              <div key={idx} className="flex-shrink-0">
                <Button
                  onClick={() => {
                    if (error) setError("");
                    setInputTopic(prompt.value);
                    setShouldFocusEnd(true);
                  }}
                  className="inline-flex justify-center items-center p-2 gap-2 text-black-300 border-2 border-black-100 bg-white-500 !rounded-full hover:bg-white-600 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5 stroke-black-100"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                    <path d="M9 12h6" />
                    <path d="M12 9v6" />
                  </svg>{" "}
                  <span className="text-body-2 sm:text-body-1-regular">
                    {prompt.label}
                  </span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
