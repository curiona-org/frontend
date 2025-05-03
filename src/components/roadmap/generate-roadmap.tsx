import React from "react";

interface GenerateRoadmapProps {
  onTopicChange: (value: string) => void;
}

const GenerateRoadmap: React.FC<GenerateRoadmapProps> = ({ onTopicChange }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Type here to generate your roadmap"
        onChange={(e) => onTopicChange(e.target.value)}
        className="w-full h-[83px] shadow-lg rounded-lg dashedBorder bg-white px-5 py-7 text-gray-700 text-mobile-heading-4-regular md:text-heading-4-regular focus:outline-blue-500 focus:bg-none focus:outline-none focus:ring focus:ring-blue-500"
      />
      <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-blue-500 p-3 text-white hover:bg-blue-900 focus:outline-none transition-transform duration-300 ease-out hover:scale-105 active:scale-95">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 16 16"
          fill="var(--white-500)"
        >
          <path d="M5.398 10.807a1.04 1.04 0 0 0 1.204-.003c.178-.13.313-.31.387-.518l.447-1.373c.115-.344.308-.657.564-.914a2.35 2.35 0 0 1 .913-.565l1.391-.451a1.05 1.05 0 0 0 .645-.67a1.04 1.04 0 0 0-.689-1.31l-1.375-.447a2.34 2.34 0 0 1-1.48-1.477l-.452-1.388a1.043 1.043 0 0 0-1.717-.39a1.05 1.05 0 0 0-.256.407l-.457 1.4a2.32 2.32 0 0 1-1.44 1.449l-1.391.448a1.06 1.06 0 0 0-.644.67a1.05 1.05 0 0 0 .144.918c.128.18.309.315.517.386l1.374.445a2.33 2.33 0 0 1 1.481 1.488l.452 1.391c.072.204.206.38.382.504m6.137 4.042a.8.8 0 0 0 .926.002a.8.8 0 0 0 .3-.4l.248-.762a1.07 1.07 0 0 1 .68-.68l.772-.252a.79.79 0 0 0 .531-.64a.796.796 0 0 0-.554-.881l-.764-.249a1.08 1.08 0 0 1-.68-.678l-.252-.773a.8.8 0 0 0-.293-.39a.796.796 0 0 0-1.03.085a.8.8 0 0 0-.195.315l-.247.762a1.07 1.07 0 0 1-.665.679l-.773.252a.8.8 0 0 0-.543.762a.8.8 0 0 0 .551.756l.763.247c.159.054.304.143.422.261c.119.119.207.263.258.422l.253.774a.8.8 0 0 0 .292.388" />
        </svg>
      </button>
    </div>
  );
};

export default GenerateRoadmap;
